import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';
import Dish from '../models/Dish.js';

export const getAll = async (req, res) => {
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;

  const result = await Dish.find({}, '', {
    skip,
    limit,
  });
  res.json(result);
};

export const getById = async (req, res) => {
  const { id } = req.params;
  const result = await Dish.findById(id);

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

export const addNewDish = async (req, res) => {
  const { body } = req;
  const result = await Dish.create(body);

  res.status(201).json(result);
};

export const updateDish = async (req, res) => {
  const { body } = req;
  const { id } = req.params;

  const result = await Dish.findByIdAndUpdate(id, body, { new: true });

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

export const deleteDish = async (req, res) => {
  const { id } = req.params;
  const result = await Dish.findByIdAndDelete(id);

  if (!result) {
    throw HttpError(404);
  }

  res.json({
    message: 'Delete success',
  });
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addNewDish: ctrlWrapper(addNewDish),
  updateDish: ctrlWrapper(updateDish),
  deleteDish: ctrlWrapper(deleteDish),
};
