import express from 'express';
import { login, getMe, register } from '../controllers/auth-controller.js';
import { authenticateToken } from '../../middlewares.js';

const authRouter = express.Router();
authRouter.route('/login')
    .post(login);

authRouter.route('/register')
    .post(register);

authRouter.route('/me')
    .get(authenticateToken, getMe);


export default authRouter;