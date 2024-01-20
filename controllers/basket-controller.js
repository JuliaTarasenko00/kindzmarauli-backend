import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';
import Basket from '../models/Basket.js';
import { dishPricing } from '../helpers/index.js';

const getBasketProduct = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Basket.find({ owner });

  res.json(result);
};

const addDishBasket = async (req, res) => {
  const { _id: owner } = req.user;
  const { idProduct } = req.body;
  const duplicateIdProduct = await Basket.findOne({ idProduct, owner });
  const { finalPrice } = dishPricing(req.body);

  if (duplicateIdProduct) {
    throw HttpError(409, 'This dish is already in the basket');
  }

  const result = await Basket.create({ ...req.body, total: finalPrice, owner });

  res.status(201).json(result);
};

const updateCountDishBasket = async (req, res, operation) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const data = await Basket.findOne({ _id: id, owner });

  if (!data) {
    throw HttpError(404);
  }

  let newCount = 0;
  let newTotal = 0;
  let newBody = {};

  if (operation === 'magnification') {
    const { finalPrice } = dishPricing(data);

    newCount = data.count + 1;
    newTotal = finalPrice * newCount;

    newBody = {
      ...data._doc,
      count: newCount,
      total: newTotal,
    };
  } else if (operation === 'reduction') {
    if (data.count <= 1) {
      throw HttpError(404);
    }

    newCount = data.count - 1;
    const total = data.total / (newCount + 1);
    newTotal = data.total - total;

    newBody = {
      ...data._doc,
      count: newCount,
      total: newTotal,
    };
  }

  const result = await Basket.findByIdAndUpdate(id, newBody, {
    new: true,
  });

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

const magnificationCountDishBasket = (req, res) =>
  updateCountDishBasket(req, res, 'magnification');

const reductionCountDishBasket = (req, res) =>
  updateCountDishBasket(req, res, 'reduction');

const deleteDish = async (req, res) => {
  const { id } = req.params;
  const result = await Basket.findByIdAndDelete(id);

  if (!result) {
    throw HttpError(404);
  }

  res.json({
    message: 'Delete success',
  });
};

export default {
  getBasketProduct: ctrlWrapper(getBasketProduct),
  addDishBasket: ctrlWrapper(addDishBasket),
  reductionCountDishBasket: ctrlWrapper(reductionCountDishBasket),
  magnificationCountDishBasket: ctrlWrapper(magnificationCountDishBasket),
  deleteDish: ctrlWrapper(deleteDish),
};
