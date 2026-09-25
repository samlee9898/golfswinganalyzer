# Swing Analyzer

Swing Analyzer is a full-stack web app that helps golfers understand their swing. Users can upload an MP4 video and receive AI-generated feedback with a summary and suggestions for improvement.

## Features

- Create an account and sign in
- Upload golf swing videos with a progress indicator
- Generate and view swing analyses

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Bun, Express, TypeScript
- **Database:** MySQL
- **Storage:** Amazon S3
- **AI:** Google Gemini
- **Deployment:** AWS EC2, Nginx, PM2

## How It Works

1. Sign in and select an MP4 golf swing video.
2. The app uploads the video directly to Amazon S3 using a presigned URL.
3. The backend sends the video to Gemini for analysis.
4. The app displays the feedback and saves the analysis in MySQL.

## Local Setup

### 1. Install dependencies

From the project root:

```bash
bun install
```

### 2. Configure the server

Copy the server’s `.env.example` to `.env`, then fill in these values:

| Variable | Purpose |
| --- | --- |
| `EXPRESS_SERVER_PORT` | Port for the Express server |
| `JWT_SECRET` | Secret used to sign authentication tokens |
| `S3_BUCKET_NAME` | S3 bucket used for uploaded videos |
| `S3_BUCKET_REGION` | AWS region of the bucket |
| `S3_ACCESS_KEY` | AWS access key with access to the bucket |
| `S3_SECRET_ACCESS_KEY` | Matching AWS secret access key |
| `GEMINI_API_KEY` | Gemini API key for video analysis |
| `DB_HOST` | MySQL host |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | MySQL database name |

Keep `.env` out of version control.

### 3. Start the app

From the project root: 

```bash
bun run dev
```

This command will start both frontend and backend server.

Frontend vite server will be running on http://localhost:5173
Backend express server will be running on http://localhost:3000

OR

You could Run the frontend and backend using the scripts in their respective `package.json` files.

## Current Limitations

- The interface currently displays one swing issue from each analysis with a simple alert function
- Uploads are limited to MP4 files of 10 MB or less.
- Some backend API endpoints are still in development.
- The interface for browsing saved videos and analyses is still in development.