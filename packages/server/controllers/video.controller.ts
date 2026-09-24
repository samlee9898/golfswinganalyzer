import type { Response } from 'express';
import type { AuthRequest } from '../types/auth.type';
import videoService from '../services/video.service';
import { AppError } from '../errors/AppError';

export async function getAllVideosController(req: AuthRequest, res: Response) {
   const { userIDNumber } = req.user!;
   const videos = await videoService.getAllVideos(userIDNumber);

   res.status(200).json({ videos });
}

export async function getVideoController(req: AuthRequest, res: Response) {
   const { userIDNumber } = req.user!;
   const videoID = Number(req.params.videoID);

   const video = await videoService.getVideo(videoID, userIDNumber);

   res.status(200).json({ video });
}

export async function deleteVideoController(req: AuthRequest, res: Response) {
   const { userIDNumber } = req.user!;
   const videoID = Number(req.params.videoID);

   const isVideoDeleted = await videoService.deleteVideo(videoID, userIDNumber);

   if (!isVideoDeleted) {
      res.status(400);
   }

   res.status(200);
}

export async function createVideoUploadController(
   req: AuthRequest,
   res: Response
) {
   const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10 MB
   const { userIDNumber } = req.user!;
   const { contentType, fileSize } = req.body;

   if (contentType !== 'video/mp4') {
      throw new AppError('Only MP4 videos are allowed', 400);
   }

   // size constraint by Gemini API
   if (
      typeof fileSize !== 'number' ||
      fileSize <= 0 ||
      fileSize > MAX_VIDEO_SIZE
   ) {
      throw new AppError('Video must be 10 MB or smaller', 400);
   }

   const { uploadURL, videoID } = await videoService.prepareVideoUpload(
      userIDNumber,
      contentType
   );

   res.status(200).json({ uploadURL, videoID });
}
