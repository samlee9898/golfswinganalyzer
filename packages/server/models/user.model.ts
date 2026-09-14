import type { RowDataPacket } from 'mysql2';

export interface UserRow extends RowDataPacket {
   user_id: number;
   username: string;
   password_hash: string;
   created_at: Date;
}
