import express from 'express';
import dishesController from '../../controllers/dishes-controller.js';
import { authenticate, isValidId } from '../../middlewares/index.js';
import upload from '../../middlewares/cloudinary.js';

const dishesRouter = express.Router();

dishesRouter.get('/', dishesController.getAll);

dishesRouter.get('/specifics', dishesController.getSpecificsDish);

dishesRouter.get('/:id', isValidId, dishesController.getById);

dishesRouter.post(
  '/',
  authenticate,
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
