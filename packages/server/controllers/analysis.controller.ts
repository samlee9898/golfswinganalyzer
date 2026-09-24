import type { Response } from 'express';
import type { AuthRequest } from '../types/auth.type';
import { AppError } from '../errors/AppError';
import analysisService from '../services/analysis.service';

export async function getAllAnalysesController(
   req: AuthRequest,
   res: Response
) {
   const { userIDNumber } = req.user!;
   const videoID = Number(req.params.videoID);
}

export async function getAnalysisController(req: AuthRequest, res: Response) {
   const { userIDNumber } = req.user!;
   const videoID = Number(req.params.videoID);
}

export async function createAnalysisController(
   req: AuthRequest,
   res: Response
) {
   // things that needs to be done here
   // 1. get analysis from gemini
   // 2. store analysis to the database

   const { userIDNumber } = req.user!;
   const videoID = Number(req.params.videoID);

   if (!Number.isInteger(videoID) || videoID <= 0) {
      throw new AppError('Invalid video ID', 400);
   }

   const analysis = await analysisService.generateAnalysis(
      videoID,
      userIDNumber
   );

   res.status(200).json({ analysis });
}
