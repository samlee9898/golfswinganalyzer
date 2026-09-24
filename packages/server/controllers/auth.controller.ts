import type { Request, Response } from 'express';
import { signupService, loginService } from '../services/auth.service';
import type { AuthRequest } from '../types/auth.type';

export async function signupController(req: Request, res: Response) {
   const { username, userPassword } = req.body;

   const token = await signupService(username, userPassword);

   res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
   });

   res.status(201).json({ message: 'New user created' });
}

export async function loginController(req: Request, res: Response) {
   const { username, userPassword } = req.body;

   const token = await loginService(username, userPassword);
   res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
   });
   return res.status(200).json({ message: 'Login successful' });
}

export function logoutController(req: Request, res: Response) {
   res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
   });

   return res.status(200).json({
      message: 'Logged out successfully',
   });
}

export function getLoginStatusController(req: AuthRequest, res: Response) {
   res.status(200).json({ loggedIn: true });
}
