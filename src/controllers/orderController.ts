import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/orderService';
import { AppError } from '../utils/AppError';

const orderService = new OrderService();

export class OrderController {
  async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await orderService.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      next(new AppError(500, 'Error creating order'));
    }
  }
}