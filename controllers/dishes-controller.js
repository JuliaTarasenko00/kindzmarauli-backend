import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';
import Dish from '../models/Dish.js';

const getAll = async (req, res) => {
  const { page, limit, name } = req.query;
  const skip = (page - 1) * limit;

  if (name && name.length < 3) {
    throw HttpError(400);
  }

  const result = await Dish.find(
    { ...(name !== undefined && { name: new RegExp(`^${name}`, 'i') }) },
    '',
    {
      skip,
      limit,
    }
  );

  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const result = await Dish.findById(id);

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

const addNewDish = async (req, res) => {
  const { body } = req;
  const result = await Dish.create(body);

  res.status(201).json(result);
};

const updateDish = async (req, res) => {
  const { body } = req;
  const { id } = req.params;

  const result = await Dish.findByIdAndUpdate(id, body, { new: true });

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

const deleteDish = async (req, res) => {
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
