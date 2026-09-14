import pool from '../config/db.js';
import type { VideoRow } from '../models/video.model';
import type { ResultSetHeader } from 'mysql2';

class VideoRepository {
   async findAllVideoByUserID(user_id: number) {
      const [rows] = await pool.query<VideoRow[]>(
         `SELECT * FROM videos WHERE user_id = ? ORDER BY created_at DESC`,
         [user_id]
      );
      return rows[0] ?? null;
   }

   async findOneVideo(video_id: number) {
      const [rows] = await pool.query<VideoRow[]>(
         `SELECT * FROM videos WHERE video_id = ? ORDER BY created_at DESC`,
         [video_id]
      );
      return rows[0] ?? null;
   }

   async createVideoRecord(user_id: number, s3_key: string) {
      const [result] = await pool.query<ResultSetHeader>(
         `INSERT INTO videos (user_id, s3_key) VALUES (?, ?)`,
         [user_id, s3_key]
      );
      return result.insertId ?? null;
   }
}

export default new VideoRepository();
