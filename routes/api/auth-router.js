import { Router } from 'express';
import { validateBody } from '../../decorators/index.js';
import { userSineUpSchema, userSignInSchema } from '../../models/User.js';
import auntController from '../../controllers/auth-controller.js';

const authRouter = Router();

const userSineUpValidate = validateBody(userSineUpSchema);
const userSignInValidate = validateBody(userSignInSchema);

authRouter.post('/sineup', userSineUpValidate, auntController.sineUp);
authRouter.post('/signin', userSignInValidate, auntController.signIn);

export default authRouter;
