import express from 'express';
import dishesController from '../../controllers/dishes-controller.js';
import { validateBody } from '../../decorators/index.js';
import { dishesSchema } from '../../schemas/index.js';

const addDishesValidate = validateBody(dishesSchema);

const dishesRouter = express.Router();

dishesRouter.get('/', dishesController.getAll);

dishesRouter.get('/:id', dishesController.getById);

dishesRouter.post('/', addDishesValidate, dishesController.addNewDish);

dishesRouter.put('/:id', addDishesValidate, dishesController.updateDish);

dishesRouter.delete('/:id', dishesController.deleteDish);

export default dishesRouter;
