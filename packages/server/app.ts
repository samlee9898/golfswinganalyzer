import express from 'express';
import cookieParser from 'cookie-parser';
// import cors from 'cors'; // for local dev

import authRoute from './routes/auth.route';
import videosRoute from './routes/video.route';
import analysesRoute from './routes/analysis.route';
import errorHandler from './middleware/errorHandler'; // custom error handler function

const app = express();

// app.use(
//    cors({
//       origin: 'http://localhost:5173',
//       credentials: true,
//    })
// );

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/videos', videosRoute);
app.use('/api/videos/:videoID/analyses', analysesRoute);

app.use(errorHandler);

export default app;
