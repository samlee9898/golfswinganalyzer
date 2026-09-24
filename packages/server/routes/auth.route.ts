import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
   loginController,
   signupController,
   logoutController,
   getLoginStatusController,
} from '../controllers/auth.controller';

const router = Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/me', authMiddleware, getLoginStatusController);
router.post('/logout', logoutController);

export default router;
