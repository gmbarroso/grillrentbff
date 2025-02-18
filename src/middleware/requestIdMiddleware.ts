import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

interface ExtendedRequest extends Request {
  requestId?: string;
}

const requestIdMiddleware = (req: ExtendedRequest, res: Response, next: NextFunction): void => {
  req.requestId = uuidv4();
  next();
};

export default requestIdMiddleware;
