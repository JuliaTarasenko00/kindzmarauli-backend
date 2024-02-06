import express from 'express';
import dishesController from '../../controllers/dishes-controller.js';
import { validateBody } from '../../decorators/index.js';
import { dishJoiSchema } from '../../models/Dish.js';
import { authenticate, isValidId } from '../../middlewares/index.js';

const addDishesValidate = validateBody(dishJoiSchema);

const dishesRouter = express.Router();

dishesRouter.get('/', dishesController.getAll);

dishesRouter.get('/specifics', dishesController.getSpecificsDish);

dishesRouter.get('/:id', isValidId, dishesController.getById);

dishesRouter.post(
  '/',
  authenticate,
  addDishesValidate,
  dishesController.addNewDish
);

dishesRouter.put(
  '/:id',
  authenticate,
  isValidId,
  addDishesValidate,
  dishesController.updateDish
);

dishesRouter.delete(
  '/:id',
  authenticate,
  isValidId,
  dishesController.deleteDish
);

export default dishesRouter;
