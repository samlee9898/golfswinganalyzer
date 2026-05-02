import express from 'express';
import upload from '../middlewares/upload';
import type { Request, Response } from 'express';
import { spawn } from 'child_process';

const router = express.Router();

// replace this with real feedback from AI
const fakeFeedback = [
   'Clear body position detected.',
   'Your backswing looks slightly short.',
   'Try rotating your shoulders more at the top of the swing.',
];

function analyzeSwing(videoPath: string): Promise<any> {
   return new Promise((resolve, reject) => {
      const python = spawn('python3', ['analyzer/analyze_swing.py', videoPath]);

      let output = '';
      let error = '';

      python.stdout.on('data', (data) => {
         output += data.toString();
      });

      python.stderr.on('data', (data) => {
         error += data.toString();
      });

      python.on('close', (code) => {
         if (code !== 0) {
            return reject(new Error(error || 'Python script failed'));
         }

         resolve(JSON.parse(output));
      });
   });
}

router.post(
   '/upload',
   upload.single('video'),
   async (req: Request, res: Response) => {
      const file = req.file;

      // check if there is a file uploaded
      if (!file) {
         return res.status(400).json({ error: 'No file uploaded' });
      }

      // check if there the file is a video
      if (!file.mimetype.startsWith('video/')) {
         return res.status(400).json({ error: 'Only video files are allowed' });
      }

      const videoUrl = `/uploads/${file.filename}`;

      const analysis = await analyzeSwing(file.path);

      res.status(200).json({
         message: 'Analysis pipeline connected',
         filename: file.filename,
         analysis,
      });
   }
);

export default router;
