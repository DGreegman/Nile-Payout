import { OrderService } from './orderService';
import User from '../models/User';
import { generatePayoutPdf } from '../utils/pdfGenerator';
import { sendEmail } from '../utils/emailSender';

export class PayoutService {
  constructor(private orderService: OrderService) {}

  async calculatePayout(vendorId: string) {
    const completedOrders = await this.orderService.getCompletedOrdersByVendor(vendorId);
    const vendor = await User.findById(vendorId);

    if (!vendor) {
      throw new Error('Vendor not found');
    }

    const total_orders = completedOrders.length;
    const total_amount = completedOrders.reduce((sum, order) => sum + order.amount, 0);
    const platform_fee = total_amount * 0.05;
    const net_payout = total_amount - platform_fee;

    const payoutSummary = {
      vendor: vendor.store_name,
      total_orders,
      total_amount,
      platform_fee,
      net_payout,
    };

    // Generate PDF and send email asynchronously (non-blocking)
    generatePayoutPdf(payoutSummary).then(pdfBuffer => {
      sendEmail(
        vendor.email,
        'Your Payout Summary from Nile Payout System',
        'Please find your detailed payout summary attached.',
        `<p>Dear ${vendor.name},</p><p>Please find your detailed payout summary attached to this email.</p><p>Thank you for being a valued partner. We appreciate your hard work and dedication!</p><p>Best regards,</p><p>The Nile Payout System Team</p>`,
        [
          {
            filename: 'payout_summary.pdf',
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ]
      ).catch(emailError => {
        console.error('Failed to send payout email asynchronously:', emailError);
      });
    }).catch(pdfError => {
      console.error('Failed to generate PDF asynchronously:', pdfError);
    });

    return payoutSummary;
  }
}