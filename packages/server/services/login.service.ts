import bcrypt from 'bcrypt';
import userRepository from '../repositories/user.repository';
import { generateToken } from '../utils/jwt';
import { AppError } from '../errors/AppError';

export async function loginService(
   userID: string,
   userPassword: string
): Promise<string> {
   const user = await userRepository.findByUsername(userID);
   if (user === null) {
      throw new AppError('Invalid ID or password', 401);
   }

   const userHashedPassword = user.password_hash;
   if (userHashedPassword === null) {
      throw new AppError(
         'Something went wrong with retrieving hashed password from the database',
         500
      );
   }

   const matches = await bcrypt.compare(userPassword, userHashedPassword);
   if (!matches) {
      throw new AppError('Invalid ID or password', 401);
   }

   return generateToken(user.user_id, user.username);
}
