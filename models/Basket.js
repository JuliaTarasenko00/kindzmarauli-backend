import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { handleSaveError, runValidation } from './hooks.js';

const basketSchema = new Schema(
  {
    goods: {
      dishes: [
        {
          _id: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          image: {
            type: String,
            required: true,
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
          count: {
            type: Number,
            default: 1,
          },
          total: {
            type: Number,
          },
        },
      ],
      totalPriceDishes: {
        type: Number,
        required: true,
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

export const basketJoiSchema = Joi.object({
  goods: Joi.object({
    dishes: Joi.array().items(
      Joi.object({
        _id: Joi.string().required(),
        name: Joi.string().required(),
        image: Joi.string().required(),
        price: Joi.number().required(),
        discounted: Joi.number().default(0),
        gram: Joi.number().required(),
        count: Joi.number().default(1),
        total: Joi.number(),
      })
    ),
    totalPriceDishes: Joi.number().required(),
  }),
  owner: Joi.string().required(),
});

basketSchema.post('save', handleSaveError);
basketSchema.pre('findOneAndUpdate', runValidation);
basketSchema.post('findOneAndUpdate', handleSaveError);

const Basket = model('basket', basketSchema);

export default Basket;
