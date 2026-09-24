import type { Response, NextFunction } from 'express';
import type { AuthRequest, JWTPayload } from '../types/auth.type';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';

export function authMiddleware(
   req: AuthRequest,
   res: Response,
   next: NextFunction
) {
   const token = req.cookies.token;

   if (!token) {
      throw new AppError('token needed', 401);
   }

   try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      req.user = {
         userIDNumber: payload.userIDNumber,
         username: payload.username,
      };
      next();
   } catch {
      throw new AppError('Token cannot be verified', 401);
   }
}
