import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { loginController } from '../controllers/login.controller';
import { signupController } from '../controllers/signup.controller';
import { logoutController } from '../controllers/logout.controller';
import { getLoginStatusController } from '../controllers/getLoginStatus.controller';

const router = Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/me', authMiddleware, getLoginStatusController);
router.post('/logout', logoutController);

export default router;
