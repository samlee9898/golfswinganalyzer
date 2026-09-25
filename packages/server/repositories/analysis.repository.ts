import pool from '../config/mysql.js';
import type { ResultSetHeader } from 'mysql2';
import type { AnalysisResult, AnalysisRow } from '../models/analysis.model.js';

class AnalysisRepository {
   async createAnalysis(videoID: number) {
      const [result] = await pool.query<ResultSetHeader>(
         'INSERT INTO video_analyses (video_id) VALUES (?)',
         [videoID]
      );

      return result.insertId;
   }

   async findByAnalysisID(analysisID: number) {
      const [rows] = await pool.query<AnalysisRow[]>(
         'SELECT * FROM video_analyses WHERE analysis_id = ?',
         [analysisID]
      );

      return rows[0] ?? null;
   }

   async findByVideoID(videoID: number) {
      const [rows] = await pool.query<AnalysisRow[]>(
         'SELECT * FROM video_analyses WHERE video_id = ?',
         [videoID]
      );

      return rows;
   }

   async markAsCompleted(analysisID: number, analysis: AnalysisResult) {
      await pool.execute(
         `UPDATE video_analyses
         SET status = 'completed',
               analysis_result = ?,
               completed_at = CURRENT_TIMESTAMP
         WHERE analysis_id = ?`,
         [JSON.stringify(analysis), analysisID]
      );
   }

   async markAsFailed(analysisID: number) {
      await pool.execute(
         `UPDATE video_analyses
         SET status = 'failed',
            completed_at = CURRENT_TIMESTAMP
         WHERE analysis_id = ?`,
         [analysisID]
      );
   }
}

export default new AnalysisRepository();
