import pool from '../config/MySQL.js';
import type { UserRow } from '../models/user.model';
import type { ResultSetHeader } from 'mysql2';

class UserRepository {
   async findByUsername(username: string) {
      const [rows] = await pool.query<UserRow[]>(
         'SELECT * FROM users WHERE username = ?',
         [username]
      );
      return rows[0] ?? null;
   }

   async findByUserNumberID(userNumberID: number) {
      const [rows] = await pool.query<UserRow[]>(
         'SELECT * FROM users WHERE user_id = ?',
         [userNumberID]
      );
      return rows[0] ?? null;
   }

   async createUser(username: string, password_hash: string) {
      const [result] = await pool.query<ResultSetHeader>(
         'INSERT INTO video_analyses (username, password_hash) VALUES (?, ?)',
         [username, password_hash]
      );
      return result.insertId ?? null;
   }
}

export default new UserRepository();
