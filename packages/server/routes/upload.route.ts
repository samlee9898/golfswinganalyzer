import { Router } from 'express';
import type { Request, Response } from 'express';
import { generateUploadURL } from '../utils/generateUploadURL';

const router = Router();

router.post('/', (req: Request, res: Response) => {
   console.log('TODO: POST /api/upload/');
   res.status(200).json({ message: 'POST /api/upload called' });
});

export default router;
