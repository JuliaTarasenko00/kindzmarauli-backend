import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';
import Basket from '../models/Basket.js';
import { dishPricing } from '../helpers/index.js';
import Dish from '../models/Dish.js';

const calculateTotalPrice = state => {
  return state.reduce((sum, obj) => {
    return obj.total + sum;
  }, 0);
};

const getBasketProduct = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Basket.find({ owner });

  res.json(...result);
};

const addDishBasket = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  const dish = await Dish.findById(id);

  if (!dish) {
    throw HttpError(404);
  }

  const basketUser = await Basket.findOne({ owner });
  const { finalPrice } = dishPricing(dish);

  const duplicateIdProduct = basketUser?.goods.dishes.find(el => el._id === id);

  if (duplicateIdProduct) {
    throw HttpError(409, 'This dish is already in the basket');
  }

  const newDish = { ...dish._doc, total: finalPrice };

  const updatedDishes = basketUser
    ? [newDish, ...basketUser?.goods.dishes]
    : [newDish];

  const totalPriceBasket = calculateTotalPrice(updatedDishes);

  const updatedGoods = {
    dishes: updatedDishes,
    totalPriceDishes: totalPriceBasket,
  };

  let result;
  if (basketUser) {
    result = await Basket.findByIdAndUpdate(
      basketUser._id,
      { goods: updatedGoods },
      { new: true }
    );
  } else {
    result = await Basket.create({ goods: updatedGoods, owner });
    res.status(201);
  }

  res.json(result);
};

const updateCountDishBasket = async (req, res, operation) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const data = await Basket.findOne({ owner });

  if (!data) {
    throw HttpError(404);
  }

  const dish = data.goods.dishes.find(el => el._id.toString() === id);

  if (!dish) {
    throw HttpError(404);
  }

  let newCount = 0;
  let newTotal = 0;
  let newBody = {};

  if (operation === 'magnification') {
    const { finalPrice } = dishPricing(dish);

    newCount = dish.count + 1;
    newTotal = finalPrice * newCount;

    newBody = {
      ...dish._doc,
      count: newCount,
      total: newTotal,
    };
  } else if (operation === 'reduction') {
    if (dish.count <= 1) {
      throw HttpError(404);
    }

    newCount = dish.count - 1;
    const total = dish.total / (newCount + 1);
    newTotal = dish.total - total;

    newBody = {
      ...dish._doc,
      count: newCount,
      total: newTotal,
    };
  }
  const updatedDishes = data.goods.dishes.map(d =>
    d._id.toString() === id ? newBody : d
  );

  const totalPriceBasket = calculateTotalPrice(updatedDishes);

  const updatedGoods = {
    dishes: updatedDishes,
    totalPriceDishes: totalPriceBasket,
  };

  const result = await Basket.findByIdAndUpdate(
    data._id,
    { goods: updatedGoods },
    { new: true }
  );

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
  const { _id: owner } = req.user;
  const { id } = req.params;

  const basketUser = await Basket.findOne({ owner });

  if (!basketUser) {
    throw new HttpError(404, 'Basket not found');
  }

  const updatedDishes = basketUser.goods.dishes.filter(
    el => el._id.toString() !== id
  );

  if (!updatedDishes) {
    throw HttpError(404);
  }

  const totalPriceBasket = calculateTotalPrice(updatedDishes);

  const updatedGoods = {
    dishes: updatedDishes,
    totalPriceDishes: totalPriceBasket,
  };

  const result = await Basket.findByIdAndUpdate(
    basketUser._id,
    { goods: updatedGoods },
    { new: true }
  );

  res.json(result);
};

const removeBasket = async (req, res) => {
  const { id } = req.params;
  const result = await Basket.findByIdAndDelete(id);

  if (!result) {
    throw HttpError(404);
  }

  res.json({
    _id: result._id,
  });
};

export default {
  getBasketProduct: ctrlWrapper(getBasketProduct),
  addDishBasket: ctrlWrapper(addDishBasket),
  reductionCountDishBasket: ctrlWrapper(reductionCountDishBasket),
  magnificationCountDishBasket: ctrlWrapper(magnificationCountDishBasket),
  deleteDish: ctrlWrapper(deleteDish),
  removeBasket: ctrlWrapper(removeBasket),
};
