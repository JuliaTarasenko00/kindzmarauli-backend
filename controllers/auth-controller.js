import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';
import User from '../models/User.js';

const { JWT_SECRET } = process.env;

const sineUp = async (req, res) => {
  const { email, password } = req.body;
  const userDuplicate = await User.findOne({ email });

  if (userDuplicate) {
    throw HttpError(409, 'Password or Email invalid');
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  const payload = {
    id: newUser._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2d' });

  res.status(201).json({
    fullName: newUser.fullName,
    email: newUser.email,
    subscription: newUser.subscription,
    phoneNumber: newUser.phoneNumber,
    token,
  });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, 'Password or Email invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, 'Password or Email invalid');
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2d' });

  res.json({
    fullName: user.fullName,
    email: user.email,
    subscription: user.subscription,
    phoneNumber: user.phoneNumber,
    token,
  });
};

export default {
  sineUp: ctrlWrapper(sineUp),
  signIn: ctrlWrapper(signIn),
};
