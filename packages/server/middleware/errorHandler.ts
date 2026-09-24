import type { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/appError';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
   // console.error(err);

   const statusCode = err instanceof AppError ? err.statusCode : 500;

   const message =
      err instanceof AppError ? err.message : 'Internal server error';

   res.status(statusCode).json({ message });
};

export default errorHandler;
