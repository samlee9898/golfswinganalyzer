// This file will check env variables

import 'dotenv/config';

const REQUIRED_ENV_VARS = [
   'JWT_SECRET',
   'BUCKET_NAME',
   'BUCKET_REGION',
   'ACCESS_KEY',
   'SECRET_ACCESS_KEY',
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
