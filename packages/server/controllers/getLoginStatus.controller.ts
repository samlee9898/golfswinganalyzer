import type { Request, Response } from 'express';

export function getLoginStatusController(req: Request, res: Response) {
   res.status(200).json({ loggedIn: true });
}
