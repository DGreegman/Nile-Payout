
import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { createOrderValidation } from '../middleware/orderValidation';
import { validate } from '../middleware/validationMiddleware';

const router = Router();
const orderController = new OrderController();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - amount
 *               - vendor
 *             properties:
 *               order_id:
 *                 type: string
 *               amount:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [pending, completed]
 *               vendor:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating order
 */
router.post('/', createOrderValidation, validate, orderController.createOrder);

export default router;
