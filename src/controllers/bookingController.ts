import { Request, Response } from 'express';
import { UserRequest } from '../types/express';
import { CreateBookingDto } from '../dtos/bookingDto';
import { createBookingSchema } from '../validators/bookingValidator';
import bookingService from '../services/bookingService';

class BookingController {
  async createBooking(req: UserRequest, res: Response): Promise<void> {
    const { error } = createBookingSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }

    const bookingData: CreateBookingDto = req.body;
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        res.status(401).send('Unauthorized');
        return;
      }
      const result = await bookingService.create(bookingData, token);
      res.status(201).send(result);
    } catch (err) {
      res.status(400).send({ message: (err as Error).message });
    }
  }

  async getAllBookings(req: Request, res: Response): Promise<void> {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        res.status(401).send('Unauthorized');
        return;
      }
      const { page = 1, limit = 10, sort = 'startTime', order = 'ASC' } = req.query;
      const result = await bookingService.findAll(token, Number(page), Number(limit), String(sort), order as 'ASC' | 'DESC');
      res.status(200).send(result);
    } catch (err) {
      res.status(401).send({ message: (err as Error).message });
    }
  }

  async getBookingsByUser(req: Request, res: Response): Promise<void> {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        res.status(401).send('Unauthorized');
        return;
      }
      const { page = 1, limit = 10, sort = 'startTime', order = 'ASC' } = req.query;
      const result = await bookingService.findByUser(req.params.userId, token, Number(page), Number(limit), String(sort), order as 'ASC' | 'DESC');
      res.status(200).send(result);
    } catch (err) {
      res.status(404).send({ message: (err as Error).message });
    }
  }

  async deleteBooking(req: Request, res: Response): Promise<void> {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        res.status(401).send('Unauthorized');
        return;
      }
      const result = await bookingService.remove(req.params.id, token);
      res.status(200).send(result);
    } catch (err) {
      res.status(404).send({ message: (err as Error).message });
    }
  }

  async availability(req: Request, res: Response): Promise<void> {
    const { resourceId } = req.params;
    const { startTime, endTime } = req.query;

    if (!resourceId || !startTime || !endTime) {
      res.status(400).send({ message: 'Missing required parameters' });
      return;
    }

    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        res.status(401).send('Unauthorized');
        return;
      }
      const result = await bookingService.checkAvailability(resourceId, new Date(startTime as string), new Date(endTime as string), token);
      res.status(200).send(result);
    } catch (err) {
      res.status(400).send({ message: (err as Error).message });
    }
  }

  async getReservedTimes(req: Request, res: Response): Promise<void> {
    const { resourceType, date } = req.query;

    if (!resourceType) {
      res.status(400).send({ message: 'resourceType is required' });
      return;
    }

    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        res.status(401).send({ message: 'Unauthorized' });
        return;
      }

      const result = await bookingService.getReservedTimes(resourceType as string, date as string | undefined, token);

      if (resourceType === 'grill') {
        res.status(200).send({ reservedDays: result.reservedDays });
      } else {
        res.status(200).send({ reservedTimes: result.reservedTimes });
      }
    } catch (err) {
      res.status(400).send({ message: (err as Error).message });
    }
  }
}

export default new BookingController();
