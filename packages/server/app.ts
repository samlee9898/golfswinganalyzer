import './config/env';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// routes
import uploadRoutes from './routes/upload.route';
import downloadRoutes from './routes/download.route';
import authRoutes from './routes/auth.routes';

// custom error handler middleware
import errorHandler from './middleware/errorHandler';

const app = express();

app.use(
   cors({
      origin: 'http://localhost:5173',
      credentials: true,
   })
);

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/download', downloadRoutes);

app.use(errorHandler);

export default app;
