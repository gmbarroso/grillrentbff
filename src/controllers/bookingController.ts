import { Request, Response } from 'express';
import { UserRequest } from '../types/express';
import { CreateBookingDto, CheckAvailabilityDto } from '../dtos/bookingDto';
import { createBookingSchema, checkAvailabilitySchema } from '../validators/bookingValidator';
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
    const result = await bookingService.findAll();
    res.status(200).send(result);
  }

  async getBookingsByUser(req: Request, res: Response): Promise<void> {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        res.status(401).send('Unauthorized');
        return;
      }
      const result = await bookingService.findByUser(req.params.userId, token);
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

  async checkAvailability(req: Request, res: Response): Promise<void> {
    const { error } = checkAvailabilitySchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }

    const availabilityData: CheckAvailabilityDto = req.body;
    const result = await bookingService.checkAvailability(availabilityData.resourceId, new Date(availabilityData.startTime), new Date(availabilityData.endTime));
    res.status(200).send(result);
  }
}

export default new BookingController();
