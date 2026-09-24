import type { RowDataPacket } from 'mysql2';
import * as z from 'zod';

export const analysisJsonSchema = {
   type: 'object',
   properties: {
      analyzable: { type: 'boolean' },
      reason: {
         type: 'string',
         description: 'Why the video cannot be analyzed; empty if analyzable.',
      },
      summary: { type: 'string' },
      strengths: { type: 'array', items: { type: 'string' } },
      improvements: { type: 'array', items: { type: 'string' } },
      recommended_drills: { type: 'array', items: { type: 'string' } },
      practice_plans: { type: 'array', items: { type: 'string' } },
      recording_recommendations: {
         type: 'array',
         items: { type: 'string' },
      },
   },
   required: [
      'analyzable',
      'reason',
      'summary',
      'strengths',
      'improvements',
      'recommended_drills',
      'practice_plans',
      'recording_recommendations',
   ],
} as const;

export const analysisSchema = z.fromJSONSchema({
   ...analysisJsonSchema,
   required: [...analysisJsonSchema.required],
});
export type AnalysisResult = z.infer<typeof analysisSchema>;

type AnalysisStatus = 'processing' | 'completed' | 'failed';

export interface AnalysisRow extends RowDataPacket {
   analysis_id: number;
   video_id: number;
   status: AnalysisStatus;
   analysis_result: AnalysisResult | null;
   created_at: Date;
   completed_at: Date | null;
}
