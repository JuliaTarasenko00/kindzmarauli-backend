import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { handleSaveError, runValidation } from './hooks.js';

const emailRegexp =
  /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;

const userStatus = {
  values: ['Admin', 'User'],
  message: "'subscription invalid'",
};

const phoneRegexp = /^0\d{2}\d{7}$/;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: emailRegexp,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: 8,
      required: true,
    },
    subscription: {
      type: String,
      enum: userStatus,
      default: 'User',
    },
    phoneNumber: {
      type: String,
      match: phoneRegexp,
    },
    token: {
      type: String,
    },
  },
  { versionKey: false }
);

userSchema.post('save', handleSaveError);
userSchema.pre('findOneAndUpdate', runValidation);
userSchema.post('findOneAndUpdate', handleSaveError);

export const userSineUpSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(8).required(),
  subscription: Joi.string()
    .valid(...userStatus.values)
    .messages({
      'any.only': `subscription invalid`,
    }),
  phoneNumber: Joi.string().pattern(phoneRegexp),
});

export const userSignInSchema = Joi.object({
  password: Joi.string().min(8).required(),
  email: Joi.string().pattern(emailRegexp).required(),
});

const User = model('user', userSchema);

export default User;
