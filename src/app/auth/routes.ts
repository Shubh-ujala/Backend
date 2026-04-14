import express from 'express'
import type{Router} from 'express'
import AuthenticationController from './controller';

const authenticationController = new AuthenticationController();

export const authRouter:Router = express.Router()

authRouter.post('/sign-up',authenticationController.handleSignup.bind(authenticationController));