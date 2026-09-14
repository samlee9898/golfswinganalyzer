import type { Request, Response, NextFunction } from 'express';
import { signupService } from '../services/signup.service';

export async function signupController(
   req: Request,
   res: Response,
   next: NextFunction
) {
   const { userID, userPassword } = req.body;
   try {
      const token = await signupService(userID, userPassword);
   } catch (error) {
      return next(error);
   }

   res.status(201).json({ message: 'New user created' });
}
