
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import config from './config';
import path from 'path';

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

// Serve Swagger UI assets explicitly
// app.use('/api-docs', swaggerUi.serveFiles(swaggerSpec), swaggerUi.setup(swaggerSpec));
app.use('/api-docs', (req:Request, res:Response, next:NextFunction) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'");
  next();
}, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', authRoutes);
app.use('/orders', authMiddleware, orderRoutes);
app.use('/payouts', authMiddleware, payoutRoutes);
app.use('/health', healthRoutes);

app.use(errorHandler);

// Conditional server start for local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running locally on port ${PORT}`);
  });
}

// Export the app for Vercel
export default app;
