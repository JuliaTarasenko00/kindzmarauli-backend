import { Router } from 'express';
import basketsController from '../../controllers/basket-controller.js';
import { authenticate, isValidId } from '../../middlewares/index.js';

const basketRouter = Router();

basketRouter.use(authenticate);

basketRouter.get('/', basketsController.getBasketProduct);
basketRouter.post(
  '/addToBasket/:id',
  isValidId,
  basketsController.addDishBasket
);
basketRouter.put(
  '/magnification/:id',
  isValidId,
  basketsController.magnificationCountDishBasket
);
basketRouter.put(
  '/reduction/:id',
  isValidId,
  basketsController.reductionCountDishBasket
);
basketRouter.delete(
  '/delete/dish/:id',
  isValidId,
  basketsController.deleteDish
);
basketRouter.delete('/clear/:id', isValidId, basketsController.removeBasket);

export default basketRouter;
