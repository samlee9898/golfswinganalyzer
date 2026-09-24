interface SwingAnalysisResult {
   overallAssessment: string;
   strengths: string[];
   areasToImprove: {
      issue: string;
      observation: string;
      possibleEffect: string;
      recommendation: string;
   }[];
   recommendedDrills: {
      name: string;
      instructions: string;
   }[];
   priorities: string[];
   recordingRecommendations: string[];
}
