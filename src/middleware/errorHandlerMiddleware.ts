import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';
import { UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '../exceptions';

const errorHandlerMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);

  if (err instanceof ValidationError) {
    res.status(400).send({ message: 'Validation Error', details: err.details });
    return;
  }

  if (err instanceof UnauthorizedException) {
    res.status(401).send({ message: err.message });
    return;
  }

  if (err instanceof ConflictException) {
    res.status(409).send({ message: err.message });
    return;
  }

  if (err instanceof NotFoundException) {
    res.status(404).send({ message: err.message });
    return;
  }

  if (err instanceof BadRequestException) {
    res.status(400).send({ message: err.message });
    return;
  }

  res.status(500).send({ message: 'Internal Server Error' });
};

export default errorHandlerMiddleware;
