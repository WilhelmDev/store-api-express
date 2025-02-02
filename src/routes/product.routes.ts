import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createProduct, getProductById, getStoreProducts } from '../controllers/product.controller';

const router = Router();

router.get(
  '/all',
  [ authMiddleware ],
  getStoreProducts
)

router.get(
  '/:id',
  [ authMiddleware ],
  getProductById
)

router.post(
  '/create',
  [ authMiddleware ],
  createProduct
)

export default router;