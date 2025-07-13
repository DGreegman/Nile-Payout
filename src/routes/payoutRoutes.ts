
import { Router } from 'express';
import { PayoutController } from '../controllers/payoutController';

const router = Router();
const payoutController = new PayoutController();

/**
 * @swagger
 * /payouts/{vendorId}:
 *   get:
 *     summary: Get payout for a vendor
 *     tags: [Payouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payout calculated successfully
 *       404:
 *         description: Vendor not found
 *       500:
 *         description: Error calculating payout
 */
router.get('/:vendorId', payoutController.getPayout);

export default router;
