import { Router } from 'express';
import { createUser, getAllUsers, getUserById } from '../controllers/user.controllers';

const router = Router();

router.get(
  '/',
  getAllUsers
)
router.post(
  '/create',
  createUser
)
router.route('/:id')
  .get(
    getUserById
  )

export default router;