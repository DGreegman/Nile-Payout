import { Request, Response, NextFunction } from 'express';
import { PayoutService } from '../services/payoutService';
import { OrderService } from '../services/orderService';
import { AppError } from '../utils/AppError';

const orderService = new OrderService();
const payoutService = new PayoutService(orderService);

export class PayoutController {
  async getPayout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vendorId = req.params.vendorId;
      const payout = await payoutService.calculatePayout(vendorId);

      res.status(200).json(payout);
    } catch (error) {
      if (error instanceof Error && error.message === 'Vendor not found') {
        return next(new AppError(404, error.message));
      }
      next(new AppError(500, 'Error calculating payout'));
    }
  }
}