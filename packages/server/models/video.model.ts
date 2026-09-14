import type { RowDataPacket } from 'mysql2';

export interface VideoRow extends RowDataPacket {
   video_id: number;
   user_id: number;
   s3_key: string;
   created_at: Date;
}
