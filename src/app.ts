
import express from 'express';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import config from './config';

import orderRoutes from './routes/orderRoutes';
import payoutRoutes from './routes/payoutRoutes';
import authRoutes from './routes/authRoutes';
import { authMiddleware } from './middleware/authMiddleware';
import { errorHandler } from './middleware/errorHandler';
import swaggerSpec from './docs/swaggerDef';
import healthRoutes from './routes/healthRoutes';
import { dbConnect } from './utils/dbConnect';

const app = express();

// Middleware to connect to DB on each request (Vercel serverless)
app.use(async (req, res, next) => {
  await dbConnect();
  next();
});

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', authRoutes);
app.use('/orders', authMiddleware, orderRoutes);
app.use('/payouts', authMiddleware, payoutRoutes);
app.use('/health', healthRoutes);

app.use(errorHandler);

// Export the app for Vercel
export default app;
