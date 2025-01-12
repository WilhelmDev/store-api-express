import { Router } from 'express';
import { loginUser } from '../controllers/user.controllers';

const router = Router();

router.post(
  '/login',
  loginUser
)

export default router;