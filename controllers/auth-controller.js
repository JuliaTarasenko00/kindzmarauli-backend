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
  const { _id: id } = newUser;

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2d' });
  await User.findByIdAndUpdate(id, { token });

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
  const { _id: id } = user;

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2d' });
  await User.findByIdAndUpdate(id, { token });

  res.json({
    fullName: user.fullName,
    email: user.email,
    subscription: user.subscription,
    phoneNumber: user.phoneNumber,
    token,
  });
};

const getCurrent = async (req, res) => {
  const { _id, fullName, email, subscription, phoneNumber } = req.user;

  res.json({
    _id,
    fullName,
    email,
    subscription,
    phoneNumber,
  });
};

const logOut = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });

  res.json({
    message: 'Signout success',
  });
};

export default {
  sineUp: ctrlWrapper(sineUp),
  signIn: ctrlWrapper(signIn),
  getCurrent: ctrlWrapper(getCurrent),
  logOut: ctrlWrapper(logOut),
};
