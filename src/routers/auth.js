import { Router } from 'express';
import { validateBody } from '../utils/validateBody.js';
import { userSighninSchema, userSighnupSchema } from '../validation/users.js';
import * as authControllers from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const authRouter = Router();

authRouter.post(
  '/signup',
  validateBody(userSighnupSchema),
  ctrlWrapper(authControllers.signupController),
);

authRouter.get('/verify', authControllers.verifyController);

authRouter.post(
  '/signin',
  validateBody(userSighninSchema),
  ctrlWrapper(authControllers.siginController),
);

authRouter.post(
  '/refresh',
  validateBody(userSighninSchema),
  ctrlWrapper(authControllers.refreshController),
);

export default authRouter;
