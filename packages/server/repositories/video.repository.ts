import pool from '../config/mysql.js';
import type { VideoRow } from '../models/video.model';
import type { ResultSetHeader } from 'mysql2';

class VideoRepository {
   async findAllVideosByUserIDNumber(userIDNumber: number) {
      const [rows] = await pool.query<VideoRow[]>(
         `SELECT * FROM videos WHERE user_id = ? ORDER BY created_at DESC`,
         [userIDNumber]
      );

      return rows;
   }

   async findVideoByIDAndUserIDNumber(video_id: number, userIDNumber: number) {
      const [rows] = await pool.query<VideoRow[]>(
         `SELECT * FROM videos WHERE video_id = ? AND user_id = ?`,
         [video_id, userIDNumber]
      );

      return rows[0] ?? null;
   }

   async createVideo(userIDNumber: number, s3_key: string) {
      const [result] = await pool.query<ResultSetHeader>(
         `INSERT INTO videos (user_id, s3_key) VALUES (?, ?)`,
         [userIDNumber, s3_key]
      );

      return result.insertId ?? null;
   }

   async deleteVideo(video_id: number, userIDNumber: number) {
      const [result] = await pool.query<ResultSetHeader>(
         `DELETE FROM videos WHERE video_id = ? AND user_id = ?`,
         [video_id, userIDNumber]
      );

      return result.affectedRows > 0;
   }
}

export default new VideoRepository();
