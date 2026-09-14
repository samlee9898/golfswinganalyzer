import '../config/env';
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';

export function authMiddleware(
   req: Request,
   res: Response,
   next: NextFunction
) {
   const token = req.cookies.token;

   if (!token) {
      throw new AppError('token needed', 401);
   }

   try {
      jwt.verify(token, process.env.JWT_SECRET!);
   } catch {
      throw new AppError('Token cannot be verified', 401);
   }

   next();
}
