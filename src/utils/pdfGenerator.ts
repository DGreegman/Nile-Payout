
import PDFDocument from 'pdfkit';

interface PayoutSummary {
  vendor: string;
  total_orders: number;
  total_amount: number;
  platform_fee: number;
  net_payout: number;
}

export const generatePayoutPdf = (summary: PayoutSummary): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
    doc.on('error', reject);

    doc.fontSize(25).text('Payout Summary', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Vendor: ${summary.vendor}`);
    doc.text(`Total Orders: ${summary.total_orders}`);
    doc.text(`Total Amount: $${(summary.total_amount / 100).toFixed(2)}`);
    doc.text(`Platform Fee (5%): $${(summary.platform_fee / 100).toFixed(2)}`);
    doc.text(`Net Payout: $${(summary.net_payout / 100).toFixed(2)}`);
    doc.moveDown();

    doc.fontSize(10).text('Courtesy Message: Thank you for being a valued partner. We appreciate your hard work and dedication!');

    doc.end();
  });
};
