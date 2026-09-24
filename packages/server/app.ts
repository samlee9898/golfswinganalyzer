import express from 'express';
import cookieParser from 'cookie-parser';

import authRoute from './routes/auth.route';
import videosRoute from './routes/video.route';
import analysesRoute from './routes/analysis.route';
import errorHandler from './middleware/errorHandler'; // custom error handler function

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/videos', videosRoute);
app.use('/api/videos/:videoID/analyses', analysesRoute);

app.use(errorHandler);

export default app;
