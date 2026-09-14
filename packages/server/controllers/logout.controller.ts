import type { Request, Response } from 'express';

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
