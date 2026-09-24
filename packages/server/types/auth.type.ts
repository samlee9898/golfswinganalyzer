import type { Request } from 'express';

export interface AuthUser {
   userIDNumber: number;
   username: string;
}

export interface AuthRequest extends Request {
   user?: AuthUser;
}

export interface JWTPayload {
   userIDNumber: number;
   username: string;
}
