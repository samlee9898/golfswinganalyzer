import bcrypt from 'bcrypt';
import userRepository from '../repositories/user.repository';
import { generateToken } from '../utils/jwt';
import { AppError } from '../errors/AppError';

export async function signupService(
   userID: string,
   userPassword: string
): Promise<string> {
   const existingUser = await userRepository.findByUsername(userID);

   if (existingUser) {
      throw new AppError('UserID already exists', 409);
   }

   const hashedPassword = await bcrypt.hash(userPassword, 4);

   const userNumberID = await userRepository.createUser(userID, hashedPassword);

   return generateToken(userNumberID, userID);
}
