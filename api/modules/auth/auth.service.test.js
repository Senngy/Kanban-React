import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './auth.service.js';
import { authRepository } from './auth.repository.js';
import { scrypt } from '../../utils/scrypt.js';
import jwt from 'jsonwebtoken';
import { AppError } from '../../utils/errors.js';
import { StatusCodes } from 'http-status-codes';

vi.mock('./auth.repository.js');
vi.mock('../../utils/scrypt.js');
vi.mock('jsonwebtoken', () => ({
    default: {
        sign: vi.fn(),
        verify: vi.fn(),
        decode: vi.fn()
    }
}));

vi.mock('../../utils/logger.js', () => ({
    logger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
    }
}));

describe('AuthService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            const userData = { username: 'testuser', email: 'test@example.com', password: 'password123' };
            const mockUser = { id: 1, username: 'testuser' };

            authRepository.findUserByEmail.mockResolvedValue(null);
            scrypt.hash.mockReturnValue('hashed_password');
            authRepository.createUser.mockResolvedValue(mockUser);

            // Mocks for token generation
            vi.spyOn(authService, 'generateAccessToken').mockReturnValue('access_token');
            vi.spyOn(authService, 'generateRefreshToken').mockReturnValue({ token: 'refresh_token', jti: 'jti_1' });
            vi.spyOn(authService, 'storeRefreshToken').mockResolvedValue();

            const result = await authService.register(userData);

            expect(authRepository.findUserByEmail).toHaveBeenCalledWith(userData.email);
            expect(scrypt.hash).toHaveBeenCalledWith(userData.password);
            expect(authRepository.createUser).toHaveBeenCalled();
            expect(result.user).toEqual(mockUser);
            expect(result.accessToken).toBe('access_token');
        });

        it('should throw error if email already exists', async () => {
            authRepository.findUserByEmail.mockResolvedValue({ id: 1 });
            await expect(authService.register({ email: 'exists@test.com' }))
                .rejects.toThrow(AppError);
        });
    });

    describe('refresh', () => {
        it('should rotate tokens successfully', async () => {
            const oldToken = 'old_refresh_token';
            const decoded = { jti: 'jti_old', user_id: 1 };
            const storedToken = { jti: 'jti_old', token: 'hashed_old_token', user_id: 1, expires_at: new Date(Date.now() + 10000) };

            jwt.verify.mockReturnValue(decoded);
            authRepository.findRefreshTokenByJti.mockResolvedValue(storedToken);
            scrypt.compare.mockReturnValue(true);
            authRepository.deleteRefreshTokenByJti.mockResolvedValue(1);

            vi.spyOn(authService, 'generateAccessToken').mockReturnValue('new_access_token');
            vi.spyOn(authService, 'generateRefreshToken').mockReturnValue({ token: 'new_refresh_token', jti: 'jti_new' });
            vi.spyOn(authService, 'storeRefreshToken').mockResolvedValue();

            const result = await authService.refresh(oldToken);

            expect(authRepository.deleteRefreshTokenByJti).toHaveBeenCalledWith('jti_old');
            expect(result.accessToken).toBe('new_access_token');
            expect(result.refreshToken).toBe('new_refresh_token');
        });

        it('should detect fraud and revoke all session if jti not in DB', async () => {
            const token = 'stolen_token';
            jwt.verify.mockReturnValue({ jti: 'jti_stolen', user_id: 1 });
            authRepository.findRefreshTokenByJti.mockResolvedValue(null);

            try {
                await authService.refresh(token);
                expect.fail("Should have thrown an error");
            } catch (err) {
                expect(err.message).toContain("Security breach detected");
                expect(err.statusCode).toBe(StatusCodes.UNAUTHORIZED);
            }
            expect(authRepository.deleteAllUserRefreshTokens).toHaveBeenCalledWith(1);
        });
    });
});
