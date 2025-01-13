import { Router } from 'express';
import { getStoreById } from '../controllers/store.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get(
  '/user',
  [ authMiddleware ],
  getStoreById
)

export default router;