import { Request, Response, NextFunction} from 'express';
import UserService from '../services/user.service';
import logger, { logError } from '../utils/logger';
import ProductService from '../services/product.service';
import { imageService } from '../services/image.service';

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
    const { name, price, categoryId, images } = req.body;
    if (!name ||!price ||!categoryId) {
      logger.error('Missing required fields');
      res.status(400).json({ success: false, message: 'Missing required fields' });
      return;
    }
    const product = await ProductService.create(name, price, user.storeId, categoryId);
    logger.info(`Created new product with id: ${product.id}`);

    if (images && Array.isArray(images)) {
      const productImages = await Promise.all(
        images.map(async (image: string) => {
          const matches = image.match(/^data:image\/([A-Za-z]+);base64,/);
          if (!matches || matches.length !== 2) {
            throw new Error('Invalid image format');
          }
          const extension = matches[1].toLowerCase();
          const base64Data = image.replace(/^data:image\/[A-Za-z]+;base64,/, '');
          
          const objectName = await imageService.uploadProductImage(base64Data, extension);
          logger.info(`Uploaded image for product ${product.id}: ${objectName}`);
          return await ProductService.addImage(product.id, objectName);
        })
      );
    }
    const productWithImages = await ProductService.getById(product.id);
    res.status(201).json({ success: true, data: productWithImages });
    return
  } catch (error) {
    logError(error as Error);
    res.status(500).json({ success: false, message: 'Server error' });
    return;
  }
}