// This file will check if required env variables are set

// mount env variables
import 'dotenv/config';

const REQUIRED_ENV_VARS = [
   'EXPRESS_SERVER_PORT',
   'JWT_SECRET',
   'S3_BUCKET_NAME',
   'S3_BUCKET_REGION',
   'S3_ACCESS_KEY',
   'S3_SECRET_ACCESS_KEY',
   'DB_HOST',
   'DB_USER',
   'DB_PASSWORD',
   'DB_NAME',
   'GEMINI_API_KEY',
];

const missingVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
   throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
   );
}
