import { Request, Response } from 'express';
import { CreateBookingDto, CheckAvailabilityDto } from '../dtos/bookingDto';
import { createBookingSchema, checkAvailabilitySchema } from '../validators/bookingValidator';
import bookingService from '../services/bookingService';

class BookingController {
  async createBooking(req: Request, res: Response): Promise<Response> {
    const { error } = createBookingSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const bookingData: CreateBookingDto = req.body;
    try {
      if (!req.user) return res.status(401).send('Unauthorized');
      const result = await bookingService.create(bookingData, req.user.sub);
      return res.status(201).send(result);
    } catch (err) {
      return res.status(400).send({ message: (err as Error).message });
    }
  }

  async getAllBookings(req: Request, res: Response): Promise<Response> {
    const result = await bookingService.findAll();
    return res.status(200).send(result);
  }

  async getBookingsByUser(req: Request, res: Response): Promise<Response> {
    const result = await bookingService.findByUser(req.params.userId);
    return res.status(200).send(result);
  }

  async deleteBooking(req: Request, res: Response): Promise<Response> {
    try {
      const result = await bookingService.remove(req.params.id);
      return res.status(200).send(result);
    } catch (err) {
      return res.status(404).send({ message: (err as Error).message });
    }
  }

  async checkAvailability(req: Request, res: Response): Promise<Response> {
    const { error } = checkAvailabilitySchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const availabilityData: CheckAvailabilityDto = req.body;
    const result = await bookingService.checkAvailability(availabilityData.resourceId, new Date(availabilityData.startTime), new Date(availabilityData.endTime));
    return res.status(200).send(result);
  }
}

export default new BookingController();
