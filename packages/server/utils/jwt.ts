import '../config/env';
import jwt from 'jsonwebtoken';

export function generateToken(userId: number, username: string): string {
   return jwt.sign({ userId, username }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
   });
}
