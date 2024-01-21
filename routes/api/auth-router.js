import { Router } from 'express';
import { validateBody } from '../../decorators/index.js';
import { userSineUpSchema, userSignInSchema } from '../../models/User.js';
import auntController from '../../controllers/auth-controller.js';
import { authenticate } from '../../middlewares/index.js';

const authRouter = Router();

const userSineUpValidate = validateBody(userSineUpSchema);
const userSignInValidate = validateBody(userSignInSchema);

authRouter.post('/signup', userSineUpValidate, auntController.sineUp);
authRouter.post('/signin', userSignInValidate, auntController.signIn);
authRouter.get('/current', authenticate, auntController.getCurrent);
authRouter.post('/signout', authenticate, auntController.logOut);

export default authRouter;
