
import { body } from 'express-validator';

export const createOrderValidation = [
  body('order_id').notEmpty().withMessage('Order ID is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('vendor').notEmpty().withMessage('Vendor is required'),
];
