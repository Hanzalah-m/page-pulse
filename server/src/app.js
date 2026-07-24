import express from 'express';
import cors from 'cors';
import auditRoutes from './routes/audit.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use('/api', auditRoutes);
  app.use(errorHandler);

  return app;
};

export default createApp();
