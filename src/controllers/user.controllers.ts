import { Request, Response, NextFunction} from 'express';
import UserService from '../services/user.service';
import logger, { logError } from '../utils/logger';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const users = await UserService.getAll();
    logger.info(`Retrieved ${users.length} users`);
    res.status(200).json({ success: true, data: users  });
  } catch (error) {
    logError(error as Error);
    res.status(500).json({ success: false, message: 'An error occurred while retrieving users' });
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const userId = parseInt(req.params.id);
    const user = await UserService.getById(userId);

    if (!user) {
      logger.warn(`User with id ${userId} not found`);
      res.status(404).json({ success: false, message: 'User not found' });
      return
    }

    logger.info(`Retrieved user with id ${userId}`);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    logError(error as Error);
    res.status(500).json({ success: false, message: 'An error occurred while retrieving user' });
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { password, email, rolId, lastName, name } = req.body;
    const newUser = await UserService.create(password, email, name, lastName, rolId);
    logger.info(`Created new user with id: ${newUser.id}`);
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    logError(error as Error);
    res.status(500).json({ success: false, message: 'Invalid user data' });
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.getByEmail(email);
    if (!user) {
      res.status(400).json({ success: false, message: 'User does not exist' });
      return;
    }

    const { token } = await UserService.login(email, password);
    if (!token) {
      logger.warn(`Failed login attempt for user with email: ${email}`);
      res.status(401).json({ success: false, message: 'Invalid password' });
      return;
    }

    logger.info(`Logged in user with id: ${user.id}`);
    res.status(200).json({ success: true, data: {...user, token }});
  } catch (error) {
    logError(error as Error);
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}