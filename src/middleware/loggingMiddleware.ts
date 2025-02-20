import { Request, Response, NextFunction } from 'express';

const loggingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
  });
  next();
};

export default loggingMiddleware;
