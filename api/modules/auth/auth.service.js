import jwt from 'jsonwebtoken';
import { authRepository } from './auth.repository.js';
import { AppError } from '../../utils/errors.js';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../../utils/logger.js';
import { scrypt } from '../../utils/scrypt.js';
import { randomUUID } from 'node:crypto';

const ACCESS_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const authService = {
    async register(userData) {
        const { username, email, password, role } = userData;

        // 1. Vérifier si user existe déjà
        const existingUser = await authRepository.findUserByEmail(email);
        if (existingUser) {
            throw new AppError("Email already in use", StatusCodes.CONFLICT);
        }

        // 2. Hash password
        const hashedPassword = scrypt.hash(password);

        // 3. Create user
        const user = await authRepository.createUser({
            ...userData,
            password: hashedPassword,
            role_id: role === "admin" ? 1 : 2 // Simplification pour démo, à adapter si besoin
        });

        // 4. Generate tokens
        const accessToken = this.generateAccessToken(user.id);
        const { token: refreshToken, jti } = this.generateRefreshToken(user.id);

        await this.storeRefreshToken(refreshToken, user.id, jti);

        return { user, accessToken, refreshToken };
    },

    async login(username, password) {
        const user = await authRepository.findUserByUsername(username);

        if (!user || !scrypt.compare(password, user.password)) {
            throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
        }

        const accessToken = this.generateAccessToken(user.id);
        const { token: refreshToken, jti } = this.generateRefreshToken(user.id);

        await this.storeRefreshToken(refreshToken, user.id, jti);

        return { user, accessToken, refreshToken };
    },

    generateAccessToken(userId) {
        return jwt.sign({ user_id: userId }, process.env.JWT_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
    },

    generateRefreshToken(userId) {
        const jti = randomUUID();
        const token = jwt.sign(
            { user_id: userId, jti },
            process.env.JWT_REFRESH_SECRET || 'refresh_secret_fallback',
            { expiresIn: REFRESH_EXPIRES_IN }
        );
        return { token, jti };
    },

    async storeRefreshToken(token, userId, jti) {
        const decoded = jwt.decode(token);
        const expiresAt = new Date(decoded.exp * 1000);

        // Hachage du token avant stockage
        const hashedToken = scrypt.hash(token);

        await authRepository.storeRefreshToken({
            jti,
            token: hashedToken,
            user_id: userId,
            expires_at: expiresAt
        });

        logger.info({ userId, jti }, "Refresh token hashed and stored");
    },

    async refresh(providedToken) {
        try {
            const secret = process.env.JWT_REFRESH_SECRET || 'refresh_secret_fallback';
            const decoded = jwt.verify(providedToken, secret);
            const { jti, user_id: userId } = decoded;

            const storedTokenRecord = await authRepository.findRefreshTokenByJti(jti);

            // DETECTION DE FRAUDE : 
            // Si le token est valide (signature OK) mais absent de la DB, 
            // c'est potentiellement un token déjà utilisé (volé et rejoué).
            if (!storedTokenRecord) {
                logger.warn({ userId, jti }, "Reused token detected! Revoking all sessions for security.");
                await authRepository.deleteAllUserRefreshTokens(userId);
                throw new AppError("Security breach detected. Please login again.", StatusCodes.UNAUTHORIZED);
            }

            // Vérification du hash
            const isHashValid = scrypt.compare(providedToken, storedTokenRecord.token);
            if (!isHashValid) {
                logger.error({ userId, jti }, "Token hash mismatch! Potential tampering.");
                await authRepository.deleteAllUserRefreshTokens(userId);
                throw new AppError("Invalid session. All sessions revoked.", StatusCodes.UNAUTHORIZED);
            }

            if (new Date() > storedTokenRecord.expires_at) {
                await authRepository.deleteRefreshTokenByJti(jti);
                throw new AppError("Refresh token expired", StatusCodes.UNAUTHORIZED);
            }

            // ROTATION : Supprimer l'ancien, générer des nouveaux
            await authRepository.deleteRefreshTokenByJti(jti);

            const newAccessToken = this.generateAccessToken(userId);
            const { token: newRefreshToken, jti: newJti } = this.generateRefreshToken(userId);

            await this.storeRefreshToken(newRefreshToken, userId, newJti);

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (err) {
            if (err instanceof AppError) throw err;
            logger.error(err, "Refresh failed");
            throw new AppError("Invalid or expired refresh token", StatusCodes.UNAUTHORIZED);
        }
    },

    async logout(token) {
        try {
            const decoded = jwt.decode(token);
            if (decoded && decoded.jti) {
                await authRepository.deleteRefreshTokenByJti(decoded.jti);
                logger.info({ jti: decoded.jti }, "Refresh token invalidated via logout");
            }
        } catch (err) {
            logger.error(err, "Logout failed to invalidate token");
        }
    },

    getRefreshCookieOptions() {
        return {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: REFRESH_COOKIE_MAX_AGE,
            path: '/auth/refresh'
        };
    }
};
