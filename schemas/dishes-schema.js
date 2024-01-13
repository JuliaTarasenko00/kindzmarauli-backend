import Joi from 'joi';

const dishesSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  discounted: Joi.number(),
  gram: Joi.number().required(),
  specificsDish: Joi.string().required(),
  image: Joi.string().required(),
});

export default dishesSchema;
