
import nodemailer from 'nodemailer';
import config from '../config';

const transporter = nodemailer.createTransport({
  host: config.email_host,
  port: config.email_port,
  secure: true, // true for 465, false for other ports
  auth: {
    user: config.email_user,
    pass: config.email_pass,
  },
});

export const sendEmail = async (to: string, subject: string, text: string, html: string, attachments?: any[]) => {
  try {
    await transporter.sendMail({
      from: `"Nile Payout System" <${config.email_user}>`,
      to,
      subject,
      text,
      html,
      attachments,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
  }
};
