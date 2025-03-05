import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    requestId?: string;
    user?: {
      name: string;
      sub: string;
    };
  }
}

export interface UserRequest extends Request {
  user?: {
    name: string;
    sub: string;
  };
}

export interface RequestWithRequestId extends Request {
  requestId?: string;
}
