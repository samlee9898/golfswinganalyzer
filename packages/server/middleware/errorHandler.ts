import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

function errorHandler(
   err: AppError,
   req: Request,
   res: Response,
   next: NextFunction
) {
   const message =
      err instanceof AppError ? err.message : 'Internal server error';
   res.status(err.statusCode).json({ message });
}

export default errorHandler;
