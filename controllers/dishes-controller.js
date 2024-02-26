import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';
import Dish from '../models/Dish.js';

const getAll = async (req, res) => {
  const { page, limit, name } = req.query;
  const skip = (page - 1) * limit;

  if (name && name.length < 3) {
    throw HttpError(400);
  }

  const totalItems = await Dish.countDocuments({
    ...(name !== undefined && { name: new RegExp(`^${name}`, 'i') }),
  });
  const totalPages = page ? Math.ceil(totalItems / limit) : 1;

  const result = await Dish.find(
    { ...(name !== undefined && { name: new RegExp(`^${name}`, 'i') }) },
    '',
    {
      skip,
      limit,
    }
  );

  res.json({ result, totalPages });
};

const getSpecificsDish = async (req, res) => {
  const { specificsDish } = req.query;

  if (!specificsDish) {
    throw HttpError(400);
  }

  const result = await Dish.find({
    [`specificsDish.${specificsDish}`]: { $exists: true },
  });

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

  let path = '';

  if (req.file) {
    path = req.file.path;
  }

  const img = path !== '' && { image: path };

  const data = {
    ...body,
    specificsDish: JSON.parse(body.specificsDish),
    ...img,
  };

  const result = await Dish.create(data);

  res.status(201).json(result);
};

const updateDish = async (req, res) => {
  const { body } = req;
  const { id } = req.params;

  let path = '';

  if (req.file) {
    path = req.file.path;
  }

  const img = path !== '' && { image: path };

  const data = {
    ...body,
    specificsDish: JSON.parse(body.specificsDish),
    ...img,
  };

  const result = await Dish.findByIdAndUpdate(id, data, { new: true });

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
    _id: result._id,
  });
};

export default {
  getAll: ctrlWrapper(getAll),
  getSpecificsDish: ctrlWrapper(getSpecificsDish),
  getById: ctrlWrapper(getById),
  addNewDish: ctrlWrapper(addNewDish),
  updateDish: ctrlWrapper(updateDish),
  deleteDish: ctrlWrapper(deleteDish),
};
