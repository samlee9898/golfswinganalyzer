import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
   createVideoUploadController,
   getAllVideosController,
   getVideoController,
   deleteVideoController,
} from '../controllers/video.controller';

// /api/vidoes
const router = Router();

router.use(authMiddleware);

// protected routes
router.get('/', getAllVideosController);
router.post('/', createVideoUploadController);
router.get('/:videoID', getVideoController);
router.delete('/:videoID', deleteVideoController);

export default router;
