import { Router } from 'express';
import { getStoreById } from '../controllers/store.controller';

const router = Router();

router.get(
  '/:id',
  getStoreById
)

export default router;