import { AppError } from '../errors/AppError';
import AnalysisRepository from '../repositories/analysis.repository';
import videoRepository from '../repositories/video.repository';
import {
   generateDownloadURL,
   confirmVideoExists,
} from '../utils/s3ClientCommands';
import Gemini from '../config/Gemini';
import analysisPrompt from '../utils/analysisPrompt';
import { analysisJsonSchema, analysisSchema } from '../models/analysis.model';

class AnalysisService {
   async generateAnalysis(videoID: number, userIDNumber: number) {
      // This lookup also prevents one user from analyzing
      // another user's video.
      const video = await videoRepository.findVideoByIDAndUserIDNumber(
         videoID,
         userIDNumber
      );

      if (!video) {
         throw new AppError('Video not found', 404);
      }

      const videoExists = await confirmVideoExists(video.s3_key);

      if (!videoExists) {
         throw new AppError(
            'The video has not been uploaded successfully',
            409
         );
      }

      const analysisID = await AnalysisRepository.createAnalysis(videoID);

      try {
         const { downloadURL } = await generateDownloadURL(video.s3_key);

         const geminiResult = await Gemini.interactions.create({
            model: 'gemini-3.6-flash',
            input: [
               {
                  type: 'video',
                  uri: downloadURL,
                  mime_type: 'video/mp4',
               },
               {
                  type: 'text',
                  text: analysisPrompt,
               },
            ],
            response_format: {
               type: 'text',
               mime_type: 'application/json',
               schema: {
                  ...analysisJsonSchema,
                  required: [...analysisJsonSchema.required],
               },
            },
         });
         if (!geminiResult.output_text) {
            throw new AppError('Gemini returned an empty analysis', 502);
         }

         const analysis = analysisSchema.parse(
            JSON.parse(geminiResult.output_text)
         );

         await AnalysisRepository.markAsCompleted(analysisID, { analysis });

         return {
            analysisID,
            videoID,
            status: 'completed',
            result: analysis,
         };
      } catch (error) {
         await AnalysisRepository.markAsFailed(analysisID);
         throw error;
      }
   }
}

export default new AnalysisService();
