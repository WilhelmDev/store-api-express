import { Request, Response, NextFunction } from 'express';
import CartService from '../services/cart.service';
import logger, { logError } from '../utils/logger';

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId as string;
    const cart = await CartService.getCart(parseInt(userId));
    logger.info(`Cart retrieved for user ${userId}`);
    res.json({ success: true, data: cart });
  } catch (error) {
    logError(error as Error);
    res.status(500).json({ success: false, message: 'Error retrieving cart' });
  }
};

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userId as string;
    const cartItem = await CartService.addToCart(parseInt(userId), productId, quantity);
    logger.info(`Product ${productId} added to cart for user ${userId}`);
    res.status(201).json({ success: true, data: cartItem });
  } catch (error) {
    logError(error as Error);
    res.status(400).json({ success: false, message: 'Invalid cart item data' });
  }
};

export const removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.userId);
    const productId = parseInt(req.params.productId);
    await CartService.removeFromCart(userId, productId);
    logger.info(`Product ${productId} removed from cart for user ${userId}`);
    res.status(204).json({ success: true, data: null});
  } catch (error) {
    logError(error as Error);
    res.status(404).json({ success: false, message: 'Product not found in cart' });
  }
};

export const updateCartItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.userId);
    const productId = parseInt(req.params.productId);
    const { quantity } = req.body;
    const updatedItem = await CartService.updateCartItemQuantity(userId, productId, quantity);
    logger.info(`Cart item quantity updated for user ${userId}, product ${productId}`);
    res.json({ success: true, data: updatedItem  });
  } catch (error) {
    logError(error as Error);
    res.status(400).json({ success: false, message: 'Invalid cart item quantity' });
  }
};

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.userId);
    await CartService.clearCart(userId);
    logger.info(`Cart cleared for user ${userId}`);
    res.status(204).json({ success: true, data: null });
  } catch (error) {
    logError(error as Error);
    res.status(404).json({ success: false, message: 'User not found' });
  }
};
