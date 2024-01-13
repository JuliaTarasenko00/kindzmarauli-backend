import dishesService from '../models/dishes/dishes-models.js';
import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';

export const getAll = async (req, res) => {
  try {
    const result = await dishesService.listDishes();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res) => {
  const { id } = req.params;
  const result = await dishesService.getDishById(id);

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

export const addNewDish = async (req, res) => {
  const { body } = req;

  const result = await dishesService.addDish(body);

  res.status(201).json(result);
};

export const updateDish = async (req, res) => {
  const { body } = req;
  const { id } = req.params;

  const result = await dishesService.updateDish(id, body);

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

export const deleteDish = async (req, res) => {
  const { id } = req.params;
  const result = dishesService.removeDish(id);

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
