import express from 'express';
import dishesController from '../../controllers/dishes-controller.js';
import { validateBody } from '../../decorators/index.js';
import { dishJoiSchema } from '../../models/Dish.js';
import { authenticate, isValidId } from '../../middlewares/index.js';
import upload from '../../middlewares/cloudinary.js';

const addDishesValidate = validateBody(dishJoiSchema);

const dishesRouter = express.Router();

dishesRouter.get('/', dishesController.getAll);

dishesRouter.get('/specifics', dishesController.getSpecificsDish);

dishesRouter.get('/:id', isValidId, dishesController.getById);

dishesRouter.post(
  '/',
  authenticate,
  addDishesValidate,
  upload.single('image'),
  dishesController.addNewDish
);

dishesRouter.patch(
  '/:id',
  authenticate,
  upload.single('image'),
  isValidId,
  dishesController.updateDish
);

dishesRouter.delete(
  '/:id',
  authenticate,
  isValidId,
  dishesController.deleteDish
);

export default dishesRouter;
