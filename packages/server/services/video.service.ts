import { AppError } from '../errors/AppError';
import type { VideoRow } from '../models/video.model';
import { generateUploadURL } from '../utils/s3ClientCommands';
import videoRepository from '../repositories/video.repository';

class VideoService {
   async getAllVideos(userIDNumber: number): Promise<VideoRow[]> {
      return await videoRepository.findAllVideosByUserIDNumber(userIDNumber);
   }

   async getVideo(videoID: number, userIDNumber: number): Promise<VideoRow> {
      const video = await videoRepository.findVideoByIDAndUserIDNumber(
         videoID,
         userIDNumber
      );

      if (!video) {
         throw new AppError('Video not found', 404);
      }

      return video;
   }

   async deleteVideo(videoID: number, userIDNumber: number): Promise<boolean> {
      const isVideoDeleted = videoRepository.deleteVideo(videoID, userIDNumber);

      return isVideoDeleted;
   }

   async prepareVideoUpload(userIDNumber: number, contentType: string) {
      const { uploadURL, s3Key } = await generateUploadURL(
         userIDNumber,
         contentType
      );

      const videoID = await videoRepository.createVideo(userIDNumber, s3Key);

      return { videoID, uploadURL };
   }
}

export default new VideoService();
