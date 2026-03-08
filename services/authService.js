import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import {nanoid} from 'nanoid';
import {sequelize} from '../db/sequilize.js';
import {initUserModel} from '../models/user.js';
import {HttpError} from '../helpers/HttpError.js';
import {sendVerifyEmail} from './emailService.js';

const User = sequelize.models.User || initUserModel(sequelize);
const {JWT_SECRET = 'dev_secret', JWT_EXPIRES = '24h'} = process.env;

export async function registerUser(email, password) {
  const existing = await User.findOne({where: {email}});
  if (existing) {
    throw HttpError(409, 'Email in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const avatarURL = gravatar.url(email, {s: '250', d: 'identicon'}, true);
  const verificationToken = nanoid();

  const dev = process.env.NODE_ENV !== 'production';

  const user = await User.create({
    email,
    password: hashedPassword,
    subscription: 'starter',
    token: null,
    avatarURL,
    verify: dev,
    verificationToken,
  });

  sendVerifyEmail(email, verificationToken).catch((err) =>
    console.error(`[📧 Email Fail] User: ${email} | Error: ${err.message}`)
  );


  return {
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };
}

export async function loginUser(email, password) {
  const user = await User.findOne({where: {email}});

  if (!user || !user.verify) {
    throw HttpError(401, !user?.verify ? 'Email not verified' : 'Email or password is wrong');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: JWT_EXPIRES});

  await user.update({token});

  return {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };
}

export async function logoutUser(userId) {
  const [affectedCount] = await User.update(
    {token: null},
    {where: {id: userId}}
  );

  if (affectedCount === 0) {
    throw HttpError(401, 'Not authorized');
  }
}

export async function getCurrentUser(userId) {
  const user = await User.findByPk(userId, {
    attributes: ['email', 'subscription', 'avatarURL'],
  });

  if (!user) {
    throw HttpError(401, 'Not authorized');
  }

  return user;
}

export async function updateUserAvatar(userId, avatarURL) {
  const [updated] = await User.update({avatarURL}, {where: {id: userId}});
  if (!updated) throw HttpError(404, 'User not found');
  return avatarURL;
}

export async function verifyUserEmail(verificationToken) {
  const user = await User.findOne({where: {verificationToken}});

  if (!user) {
    throw HttpError(404, 'User not found');
  }

  await user.update({
    verify: true,
    verificationToken: null,
  });
}

export async function resendVerificationEmail(email) {

  const User = sequelize.models.User || initUserModel(sequelize);
  const user = await User.findOne({
    where: {
      email: email
    }
  });

  if (!user) {
    throw HttpError(404, 'User not found');
  }

  if (user.verify) {
    throw HttpError(400, 'Verification has already been passed');
  }


  await sendVerifyEmail({ email, verificationToken: user.verificationToken });
}
