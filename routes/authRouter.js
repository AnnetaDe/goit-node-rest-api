import express from 'express';
import {
  register,
  login,
  logout,
  current,
  updateAvatar,
  verifyEmail,
  resendVerification
} from '../controllers/authController.js';

import {validateBody} from '../helpers/validateBody.js';
import {authenticate} from '../middlewares/authentificate.js';
import {upload} from '../middlewares/uploads.js';
import {emailSchema, loginSchema, registerSchema} from '../schemas/authSchemas.js';


const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), register);
authRouter.post('/login', validateBody(loginSchema), login);

authRouter.get('/verify/:verificationToken', verifyEmail);

authRouter.post('/verify', validateBody(emailSchema), resendVerification);

authRouter.post('/logout', authenticate, logout);
authRouter.get('/current', authenticate, current);

authRouter.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  updateAvatar
);

export default authRouter;
