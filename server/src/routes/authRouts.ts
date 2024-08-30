import express from 'express';
import { AuthController } from '../controllers/AuthController';

export const authRouter = express.Router();
const authController = new AuthController();

authRouter.post('/signup', authController.signUp);
authRouter.post('/signin', authController.signIn);
authRouter.post('/signout', authController.signOut);
authRouter.post('/confirm', authController.manualConfirmUser.bind(authController));