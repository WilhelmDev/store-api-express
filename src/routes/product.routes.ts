import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getStoreProducts } from '../controllers/product.controller';

const router = Router();

router.get(
  '/all',
  [ authMiddleware ],
  getStoreProducts
)

export default router;