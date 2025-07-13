import dotenv from 'dotenv';
dotenv.config();

export default {
  mongo_uri: process.env.MONGO_URI as string,
  jwt_secret: process.env.JWT_SECRET as string,
  email_host: process.env.EMAIL_HOST as string,
  email_port: parseInt(process.env.EMAIL_PORT as string, 10),
  email_user: process.env.EMAIL_USER as string,
  email_pass: process.env.EMAIL_PASS as string,
};