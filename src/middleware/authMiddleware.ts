import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: {
    name: string;
    sub: string;
  };
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).send({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret') as { name: string; sub: string };
    req.user = {
      name: decoded.name,
      sub: decoded.sub,
    };
    next();
  } catch (ex) {
    res.status(400).send({ message: 'Invalid token.' });
  }
};

export default authMiddleware;
