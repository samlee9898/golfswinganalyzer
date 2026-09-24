import express from 'express';

// middleware
import cors from 'cors';
import cookieParser from 'cookie-parser';

// routes
import authRoute from './routes/auth.route';
import videosRoute from './routes/video.route';
import analysesRoute from './routes/analysis.route';

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

app.use('/api/auth', authRoute);
app.use('/api/videos', videosRoute);
app.use('/api/videos/:videoID/analyses', analysesRoute);

app.use(errorHandler);

export default app;
