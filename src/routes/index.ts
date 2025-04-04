import { Router } from 'express'
import userRoutes from './user.routes'
import authRoutes from './auth.routes'
import storeRoutes from './store.routes'
import productRoutes from './product.routes'
import categoryRoutes from './category.routes'
import cartRoutes from './cart.routes'

const router = Router()

router.use('/users', userRoutes)
router.use('/auth', authRoutes)
router.use('/stores', storeRoutes)
router.use('/products', productRoutes)
router.use('/categories', categoryRoutes)
router.use('/cart', cartRoutes)

export default router