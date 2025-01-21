import { Request, Response, NextFunction} from 'express';
import StoreService from '../services/store.service';
import logger, { logError } from '../utils/logger';
import userService from '../services/user.service';

export const getStoreById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.userId as string;

    const user = await userService.getById(+id);
    if (!user || !user.storeId) {
      logger.error(`User not found with ID: ${id}`);
      res.status(404).json({ success: false, message: 'User not found' });
      return
    }

    const store = await StoreService.getById(user.storeId, true);
    if (!store) {
      logger.error(`Store not found with ID: ${id}`);
      res.status(404).json({success: false, message: 'Store not found' });
      return
    }
    logger.info(`Store fetched successfully: ${id}`);
    res.status(200).json({ success: true, data: store });
  } catch (error) {
    logError(error as Error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }

}