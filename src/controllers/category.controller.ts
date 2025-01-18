import { Request, Response, NextFunction} from 'express';
import CategoryService from '../services/category.service';
import logger, { logError } from '../utils/logger';
import UserService from '../services/user.service';

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await CategoryService.getAll();
    logger.info(`Retrieved ${categories.length} categories`);
    res.status(200).json({ success: true, data: categories  });
  } catch (error) {
    logError(error as Error);
    res.status(500).json({ success: false, message: 'Error retrieving categories' });
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = parseInt(req.params.id);
    const category = await CategoryService.getById(categoryId);

    if (!category) {
      logger.warn(`Category with id ${categoryId} not found`);
      res.status(404).json({ success: false, message: 'Category not found' });
      return
    }

    logger.info(`Retrieved category with id ${categoryId}`);
    res.status(200).json({ success: true, data: category });

  } catch (error) {
    logError(error as Error);
    res.status(500).json({ success: false, message: 'Error retrieving category' });
  }
}

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, color } = req.body;

    if (!req.userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await UserService.getById(+req.userId);

    if (!user ||!user.storeId) {
      logger.error(`User not found with ID: ${req.userId}`);
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const newCategory = await CategoryService.create(name, color, user.storeId);

    logger.info(`Created new category with id: ${newCategory.id}`);
    res.status(201).json({ success: true, data: newCategory });

  } catch (error) {
    logError(error as Error);
    res.status(400).json({ success: false, message: 'Invalid category data' });
  }
}


export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = parseInt(req.params.id);
    const { name, color } = req.body;
    const category = await CategoryService.getById(categoryId);

    if (!category) {
      logger.warn(`Category with id ${categoryId} not found`);
      res.status(404).json({ success: false, message: 'Category not found' });
      return
    }

    const updatedCategory = await CategoryService.update(categoryId, name, color);

    logger.info(`Updated category with id: ${categoryId}`);
    res.status(200).json({ success: true, data: updatedCategory });

  } catch (error) {
    logError(error as Error);
    res.status(400).json({ success: false, message: 'Invalid category data' });
  }
}

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = parseInt(req.params.id);
    const category = await CategoryService.getById(categoryId);
    if (!category) {
      logger.warn(`Category with id ${categoryId} not found`);
      res.status(404).json({ success: false, message: 'Category not found' });
      return
    }
    await CategoryService.delete(categoryId);
    logger.info(`Deleted category with id: ${categoryId}`);
    res.status(204).json({ success: true });
  } catch (error) {
    logError(error as Error);
    res.status(500).json({ success: false, message: 'Error deleting category' });
  }
}