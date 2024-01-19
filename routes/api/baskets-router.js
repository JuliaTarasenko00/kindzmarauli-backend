import { Router } from 'express';
import basketsController from '../../controllers/basket-controller.js';
import { authenticate, isValidId } from '../../middlewares/index.js';

const basketRouter = Router();

basketRouter.get('/', authenticate, basketsController.getBasketProduct);
basketRouter.post('/', authenticate, basketsController.addDishBasket);
basketRouter.put(
  '/magnification/:id',
  authenticate,
  isValidId,
  basketsController.magnificationCountDishBasket
);
basketRouter.put(
  '/reduction/:id',
  authenticate,
  isValidId,
  basketsController.reductionCountDishBasket
);
basketRouter.delete(
  '/:id',
  authenticate,
  isValidId,
  basketsController.deleteDish
);

export default basketRouter;
