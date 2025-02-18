import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: {
    name: string;
    sub: string;
  };
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  console.log('Authorization header:', req.header('Authorization'));
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.log('No token provided');
    res.status(401).send({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret') as { name: string; sub: string };
    req.user = {
      name: decoded.name,
      sub: decoded.sub,
    };
    console.log('User authenticated:', req.user);
    next();
  } catch (ex) {
    console.log('Invalid token');
    res.status(400).send({ message: 'Invalid token.' });
  }
};

export default authMiddleware;
