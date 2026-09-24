import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
   createAnalysisController,
   getAnalysisController,
   getAllAnalysesController,
} from '../controllers/analysis.controller';

const router = Router({ mergeParams: true });

router.use(authMiddleware);

router.get('/', getAllAnalysesController); // GET /api/videos/:videoID/analyses/
router.post('/', createAnalysisController); // POST /api/videos/:videoID/analyses/
router.get('/:analysisID', getAnalysisController); // GET /api/videos/:videoID/analyses/:analysisID

export default router;
