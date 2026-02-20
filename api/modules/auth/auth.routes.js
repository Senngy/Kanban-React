import express from 'express';
import { authController } from './auth.controller.js';
import { authenticate, validateRequest } from './auth.middleware.js';
import { registerSchema, loginSchema } from './auth.validation.js';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.me);

export default router;