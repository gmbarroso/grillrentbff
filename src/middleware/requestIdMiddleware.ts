import { Response, NextFunction } from 'express';
import { RequestWithRequestId } from '../types/express';
import { v4 as uuidv4 } from 'uuid';

const requestIdMiddleware = (req: RequestWithRequestId, res: Response, next: NextFunction): void => {
  req.requestId = uuidv4();
  next();
};

export default requestIdMiddleware;
