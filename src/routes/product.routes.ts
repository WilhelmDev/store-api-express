import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createProduct, getStoreProducts } from '../controllers/product.controller';

const router = Router();

router.get(
  '/all',
  [ authMiddleware ],
  getStoreProducts
)
router.post(
  '/create',
  [ authMiddleware ],
  createProduct
)

export default router;