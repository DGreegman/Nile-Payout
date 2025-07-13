import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AppError } from '../utils/AppError';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, token } = await authService.register(req.body);
      res.status(201).json({ user, token });
    } catch (error) {
      next(new AppError(500, 'Error registering user'));
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      if (!result) {
        return next(new AppError(401, 'Invalid credentials'));
      }
      res.status(200).json(result);
    } catch (error) {
      next(new AppError(500, 'Error logging in'));
    }
  }
}