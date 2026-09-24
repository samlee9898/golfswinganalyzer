import bcrypt from 'bcrypt';
import userRepository from '../repositories/user.repository';
import { generateToken } from '../utils/jwt';
import { AppError } from '../errors/AppError';

export async function signupService(
   username: string,
   userPassword: string
): Promise<string> {
   const existingUser = await userRepository.findByUsername(username);

   if (existingUser) {
      throw new AppError('UserID already exists', 409);
   }

   const hashedPassword = await bcrypt.hash(userPassword, 4);

   const userIDNumber = await userRepository.createUser(
      username,
      hashedPassword
   );

   return generateToken(userIDNumber, username);
}

export async function loginService(
   username: string,
   userPassword: string
): Promise<string> {
   const user = await userRepository.findByUsername(username);
   if (user === null) {
      throw new AppError('Invalid ID or password', 401);
   }

   const userHashedPassword = user.password_hash;
   if (userHashedPassword === null) {
      throw new AppError(
         'Something went wrong with retrieving password from the database',
         500
      );
   }

   const matches = await bcrypt.compare(userPassword, userHashedPassword);
   if (!matches) {
      throw new AppError('Invalid ID or password', 401);
   }

   return generateToken(user.user_id, user.username);
}
