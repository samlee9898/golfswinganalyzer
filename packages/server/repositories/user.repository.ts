import mysqlPool from '../config/mysql';
import type { UserRow } from '../models/user.model';
import type { ResultSetHeader } from 'mysql2';

class UserRepository {
   async findByUsername(username: string) {
      const [rows] = await mysqlPool.query<UserRow[]>(
         'SELECT * FROM users WHERE username = ?',
         [username]
      );
      return rows[0] ?? null;
   }

   async findByUserNumberID(userNumberID: number) {
      const [rows] = await mysqlPool.query<UserRow[]>(
         'SELECT * FROM users WHERE user_id = ?',
         [userNumberID]
      );
      return rows[0] ?? null;
   }

   async createUser(username: string, passwordHash: string) {
      const [result] = await mysqlPool.query<ResultSetHeader>(
         'INSERT INTO users (username, password_hash) VALUES (?, ?)',
         [username, passwordHash]
      );
      return result.insertId;
   }
}

export default new UserRepository();
