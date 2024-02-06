import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { handleSaveError, runValidation } from './hooks.js';

const dishSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 25,
    },
    price: {
      type: Number,
      required: true,
    },
    discounted: {
      type: Number,
      default: 0,
    },
    gram: {
      type: Number,
      required: true,
    },
    specificsDish: {
      type: Object,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

export const dishJoiSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  discounted: Joi.number(),
  gram: Joi.number().required(),
  specificsDish: Joi.object().required(),
  image: Joi.string().required(),
});

dishSchema.post('save', handleSaveError);
dishSchema.pre('findOneAndUpdate', runValidation);
dishSchema.post('findOneAndUpdate', handleSaveError);

const Dish = model('dish', dishSchema);

export default Dish;
