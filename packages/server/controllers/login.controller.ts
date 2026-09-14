import type { Request, Response } from 'express';
import { loginService } from '../services/login.service';

export async function loginController(req: Request, res: Response) {
   const { userID, userPassword } = req.body;

   const token = await loginService(userID, userPassword);

   res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
   });

   return res.status(200).json({ message: 'Login successful' });
}
