import jwt from 'jsonwebtoken';
import { AppError } from '../../utils/errors.js';
import { StatusCodes } from 'http-status-codes';
import { authRepository } from './auth.repository.js';
import { logger } from '../../utils/logger.js';

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const accessTokenCookie = req.cookies.accessToken;

    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (accessTokenCookie) {
        token = accessTokenCookie;
    }

    if (!token) {
        logger.warn({ url: req.url }, "No token provided in headers or cookies");
        throw new AppError("Authentication required", StatusCodes.UNAUTHORIZED);
    }

    try {
        if (!process.env.JWT_SECRET) {
            logger.error("JWT_SECRET is not defined in environment variables!");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.user_id;
        next();
    } catch (err) {
        logger.error({
            err: { message: err.message, name: err.name },
            token: token.substring(0, 15) + "...",
            secretPresent: !!process.env.JWT_SECRET
        }, "JWT Verification failed");
        throw new AppError("Invalid or expired access token", StatusCodes.UNAUTHORIZED);
    }
};

export const checkRole = (requiredRole) => {
    return async (req, res, next) => {
        // Garantir que l'utilisateur est authentifié
        if (!req.userId) {
            // Si authenticate n'a pas été appelé avant dans le router, on le fait ici
            try {
                authenticate(req, res, () => { });
            } catch (err) {
                return next(err);
            }
        }

        const user = await authRepository.findUserById(req.userId);
        if (!user || !user.role) {
            throw new AppError("User or role not found", StatusCodes.UNAUTHORIZED);
        }

        if (user.role.name !== requiredRole && user.role.name !== 'admin') {
            throw new AppError("Forbidden: insufficient permissions", StatusCodes.FORBIDDEN);
        }

        next();
    };
};

export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            throw new AppError(error.details[0].message, StatusCodes.BAD_REQUEST);
        }
        next();
    };
};
