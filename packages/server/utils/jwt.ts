import jwt from 'jsonwebtoken';

export function generateToken(userIDNumber: number, username: string): string {
   return jwt.sign({ userIDNumber, username }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
   });
}
