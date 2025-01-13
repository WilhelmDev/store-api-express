import { Router } from 'express'
import userRoutes from './user.routes'
import authRoutes from './auth.routes'
import storeRoutes from './store.routes'

const router = Router()

router.use('/users', userRoutes)
router.use('/auth', authRoutes)
router.use('/stores', storeRoutes)

export default router