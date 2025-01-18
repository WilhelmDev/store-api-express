import { Router } from 'express';
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get(
  '/',
  getAllCategories
)
router.route('/:id')
  .get(getCategoryById)
  .patch(updateCategory)
  .delete(deleteCategory);

router.post(
  '/create',
  [ authMiddleware ],
  createCategory
)

export default router;