import jwt from 'jsonwebtoken';
import {HttpError} from '../helpers/HttpError.js'; // Standardize import
import {initUserModel} from '../models/user.js';
import {sequelize} from '../db/sequilize.js'; // Ensure path matches your DB file

const User = sequelize.models.User || initUserModel(sequelize);
const {JWT_SECRET = 'dev_secret'} = process.env;

export const authenticate = async (req, res, next) => {
  const {authorization = ''} = req.headers;
  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(HttpError(401, 'Not authorized')); // Use next() for consistency
  }

  try {
    const {id} = jwt.verify(token, JWT_SECRET);

    const user = await User.findByPk(id);

    if (!user || !user.token || user.token !== token) {
      return next(HttpError(401, 'Not authorized'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, 'Not authorized'));
  }
};
