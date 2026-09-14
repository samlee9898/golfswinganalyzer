import '../config/env';
import s3 from '../config/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

export async function generateUploadURL(): Promise<string> {
   const videoName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');
   const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME!,
      Key: `${videoName}`,
      ContentType: 'video/*',
   });
   return await getSignedUrl(s3, command, {
      expiresIn: 60,
   });
}
