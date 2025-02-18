import { Request, Response } from 'express';
import { CreateBookingDto, CheckAvailabilityDto } from '../dtos/bookingDto';
import { createBookingSchema, checkAvailabilitySchema } from '../validators/bookingValidator';
import bookingService from '../services/bookingService';

interface ExtendedRequest extends Request {
  user?: {
    name: string;
    sub: string;
  };
}

class BookingController {
  async createBooking(req: ExtendedRequest, res: Response): Promise<void> {
    console.log('Request body:', req.body);
    const { error } = createBookingSchema.validate(req.body);
    if (error) {
      console.log('Validation error:', error.details[0].message);
      res.status(400).send(error.details[0].message);
      return;
    }

    const bookingData: CreateBookingDto = req.body;
    try {
      if (!req.user) {
        console.log('Unauthorized access');
        res.status(401).send('Unauthorized');
        return;
      }
      const result = await bookingService.create(bookingData, req.user.sub);
      res.status(201).send(result);
    } catch (err) {
      console.log('Error creating booking:', (err as Error).message);
      res.status(400).send({ message: (err as Error).message });
    }
  }

  async getAllBookings(req: Request, res: Response): Promise<void> {
    const result = await bookingService.findAll();
    res.status(200).send(result);
  }

  async getBookingsByUser(req: Request, res: Response): Promise<void> {
    const result = await bookingService.findByUser(req.params.userId);
    res.status(200).send(result);
  }

  async deleteBooking(req: Request, res: Response): Promise<void> {
    try {
      const result = await bookingService.remove(req.params.id);
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
