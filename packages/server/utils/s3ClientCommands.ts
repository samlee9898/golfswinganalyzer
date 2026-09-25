import s3Client from '../config/s3';
import {
   PutObjectCommand,
   HeadObjectCommand,
   GetObjectCommand,
   DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

export async function generateUploadURL(
   userIDNumber: number,
   contentType: string
): Promise<{ uploadURL: string; s3Key: string }> {
   const randomizedVideoName = crypto.randomUUID();
   const s3Key = `videos/${userIDNumber}/${randomizedVideoName}`;
   const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: s3Key,
      ContentType: contentType,
   });

   const uploadURL = await getSignedUrl(s3Client, command, {
      expiresIn: 120,
   });

   return { uploadURL, s3Key };
}

export async function generateDownloadURL(
   s3Key: string
): Promise<{ downloadURL: string }> {
   const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: s3Key,
   });

   const downloadURL = await getSignedUrl(s3Client, command, {
      expiresIn: 120,
   });

   return { downloadURL };
}

export async function confirmVideoExistsInS3(s3Key: string): Promise<boolean> {
   const command = new HeadObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: s3Key,
   });

   try {
      await s3Client.send(command);
      return true;
   } catch (error: any) {
      if (
         error?.name === 'NotFound' ||
         error?.$metadata?.httpStatusCode === 404
      ) {
         return false;
      }

      // Permission errors, AWS outages, and other unexpected errors
      // also should not be treated as "file doesn't exist."
      // finally throw error to my error handler
      throw error;
   }
}

export async function deleteVideoFromS3(s3Key: string): Promise<void> {
   await s3Client.send(
      new DeleteObjectCommand({
         Bucket: process.env.S3_BUCKET_NAME!,
         Key: s3Key,
      })
   );
}
