import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    requestId?: string;
  }
}

export interface IGetUserAuthInfoRequest extends Request {
  user?: {
    name: string;
    sub: string;
  };
}
