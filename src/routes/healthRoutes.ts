
import { Router } from 'express';
import { HealthController } from '../controllers/healthController';

const router = Router();
const healthController = new HealthController();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: API Health Check
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Checks the health of the API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is up and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: UP
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/', healthController.getHealth);

export default router;
