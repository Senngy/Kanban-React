import { authService } from './auth.service.js';
import { authRepository } from './auth.repository.js';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../utils/errors.js';

export const authController = {
    async register(req, res) {
        const { user, accessToken, refreshToken } = await authService.register(req.body);

        res.cookie('refreshToken', refreshToken, authService.getRefreshCookieOptions());

        return res.status(StatusCodes.CREATED).json({
            token: accessToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role?.name || 'user'
            }
        });
    },

    async login(req, res) {
        const { user, accessToken, refreshToken } = await authService.login(req.body.username, req.body.password);

        res.cookie('refreshToken', refreshToken, authService.getRefreshCookieOptions());

        return res.status(StatusCodes.OK).json({
            token: accessToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role?.name || 'user'
            }
        });
    },

    async refresh(req, res) {
        const providedToken = req.cookies.refreshToken;
        const { accessToken, refreshToken } = await authService.refresh(providedToken);

        res.cookie('refreshToken', refreshToken, authService.getRefreshCookieOptions());

        return res.status(StatusCodes.OK).json({ token: accessToken });
    },

    async logout(req, res) {
        const token = req.cookies.refreshToken;
        if (token) {
            await authService.logout(token);
        }
        res.clearCookie('refreshToken', authService.getRefreshCookieOptions());
        return res.status(StatusCodes.NO_CONTENT).send();
    },

    async me(req, res) {
        const user = await authRepository.findUserById(req.userId);
        if (!user) {
            throw new AppError("User not found", StatusCodes.UNAUTHORIZED);
        }
        return res.status(StatusCodes.OK).json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role?.name || 'user'
        });
    }
};
