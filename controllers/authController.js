import * as authService from '../services/authService.js';
import {ctrl} from '../helpers/ctrl.js';

export const register = ctrl(async (req, res) => {
  const {email, password} = req.body;
  const result = await authService.registerUser(email, password);

  res.status(201).json(result);
});

export const login = ctrl(async (req, res) => {
  const {email, password} = req.body;
  const result = await authService.loginUser(email, password);
  res.json(result);
});

export const logout = ctrl(async (req, res) => {
  await authService.logoutUser(req.user.id);
  res.status(204).send();
});

export const current = ctrl(async (req, res) => {
  const result = await authService.getCurrentUser(req.user.id);
  res.json(result);
});

export const updateAvatar = ctrl(async (req, res) => {
  const avatarURL = await authService.updateUserAvatar(req.user.id, req.file.path);
  res.json({avatarURL});
});

export const verifyEmail = ctrl(async (req, res) => {
  const {verificationToken} = req.params;
  await authService.verifyUserEmail(verificationToken);

  res.json({message: 'Verification successful'});
});

export const resendVerification = ctrl(async (req, res) => {
  const {email} = req.body;
  await authService.resendVerificationEmail(email);

  res.json({message: 'Verification email sent'});
});
