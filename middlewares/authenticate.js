import jwt from 'jsonwebtoken';
import { ctrlWrapper } from '../decorators/index.js';
import { HttpError } from '../helpers/index.js';
import User from '../models/User.js';

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw HttpError(401);
  }
  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer' || !token) {
    throw HttpError(401);
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || !user.token) {
      throw HttpError(401);
    }

    if (user.subscription === 'Admin' && req.baseUrl === '/baskets') {
      throw HttpError(404, 'You do not have rights to make changes');
    }

    if (user.subscription !== 'Admin' && req.baseUrl === '/dishes') {
      throw HttpError(404, 'You do not have rights to make changes');
    }

    req.user = user;
    next();
  } catch (error) {
    const { status = 401, message } = error;
    throw HttpError(status, message);
  }
};

export default ctrlWrapper(authenticate);
