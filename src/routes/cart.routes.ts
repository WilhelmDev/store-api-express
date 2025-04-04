import { Router } from 'express';
import { getCart, addToCart, removeFromCart, updateCartItemQuantity, clearCart } from '../controllers/cart.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Aplicamos el middleware de autenticación a todas las rutas del carrito
router.use(authMiddleware);

// Obtener el carrito del usuario
router.get('/', getCart);

// Añadir un producto al carrito
router.post('/add', addToCart);

// Eliminar un producto del carrito
router.delete('/remove/:productId', removeFromCart);

// Actualizar la cantidad de un producto en el carrito
router.put('/update/:productId', updateCartItemQuantity);

// Vaciar el carrito
router.delete('/clear', clearCart);

export default router;
