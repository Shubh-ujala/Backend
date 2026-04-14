import express from 'express'
import type{Router} from 'express'
import AuthenticationController from './controller';
import { restrictToAuthenticatedUser } from '../middleware/auth-middleware';

const authenticationController = new AuthenticationController();

export const authRouter:Router = express.Router()

authRouter.post('/sign-up',authenticationController.handleSignup.bind(authenticationController));

authRouter.post('/sign-in',authenticationController.handleSignIn.bind(authenticationController))

// this has to be a authenticated route
authRouter.get('/me',restrictToAuthenticatedUser(),authenticationController.handleMe.bind(authenticationController))