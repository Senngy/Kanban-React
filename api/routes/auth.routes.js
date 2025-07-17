import express from "express";
import { authenticate, validateUserCreation } from "../middlewares/auth.middleware.js";
import { register, login, me } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', validateUserCreation, register);
router.post('/login',  login);
router.get('/me', authenticate, me);


export default router;