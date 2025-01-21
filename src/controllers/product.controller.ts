import { Request, Response, NextFunction} from 'express';
import UserService from '../services/user.service';
import logger, { logError } from '../utils/logger';
import ProductService from '../services/product.service';

export const getStoreProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId as string;
    const user = await UserService.getById(+userId);

    if (!user ||!user.storeId) {
      logger.error(`User not found with ID: ${userId}`);
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const products = await ProductService.getByStore(user.storeId);

    logger.info(`Retrieved ${products.length} products`);
    res.status(200).json({ success: true, data: products  });
  } catch (error) {
    logError(error as Error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await ProductService.getById(productId);

    if (!product) {
      logger.warn(`Product with id ${productId} not found`);
      res.status(404).json({ success: false, message: 'Product not found' });
      return
    }

    logger.info(`Retrieved product with id ${productId}`);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    logError(error as Error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId as string;
    const user = await UserService.getById(+userId);
    if (!user ||!user.storeId) {
      logger.error(`User not found with ID: ${userId}`);
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    const { name, price, categoryId } = req.body;
    if (!name ||!price ||!categoryId) {
      logger.error('Missing required fields');
      res.status(400).json({ success: false, message: 'Missing required fields' });
      return;
    }
    const product = await ProductService.create(name, price, user.storeId, categoryId);
    logger.info(`Created new product with id: ${product.id}`);
    res.status(201).json({ success: true, data: product });
    return
  } catch (error) {
    logError(error as Error);
    res.status(500).json({ success: false, message: 'Server error' });
    return;
  }
}