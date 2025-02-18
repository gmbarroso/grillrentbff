import { Request, Response } from 'express';
import bookingController from '../bookingController';
import bookingService from '../../services/bookingService';
import { CreateBookingDto } from '../../dtos/bookingDto';

jest.mock('../../services/bookingService');

describe('BookingController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    req = {};
    statusMock = jest.fn().mockReturnThis();
    sendMock = jest.fn().mockReturnThis();
    res = {
      status: statusMock,
      send: sendMock,
    };
  });

  it('should create a new booking', async () => {
    const bookingData: CreateBookingDto = {
      resourceId: 'resource-id',
      userId: 'user-id',
      startTime: new Date(Date.now() + 24 * 3600000).toISOString(),
      endTime: new Date(Date.now() + 48 * 3600000).toISOString(),
    };

    req.body = bookingData;
    req.user = { sub: 'user-id', name: 'John Doe' };
    (bookingService.create as jest.Mock).mockResolvedValue(bookingData);

    await bookingController.createBooking(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(sendMock).toHaveBeenCalledWith(bookingData);
  });

  it('should get all bookings', async () => {
    const bookings = [{ id: 'booking-id', resourceId: 'resource-id', startTime: new Date(Date.now() + 24 * 3600000), endTime: new Date(Date.now() + 48 * 3600000) }];
    (bookingService.findAll as jest.Mock).mockResolvedValue(bookings);

    await bookingController.getAllBookings(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(sendMock).toHaveBeenCalledWith(bookings);
  });

  it('should get bookings by user', async () => {
    const bookings = [{ id: 'booking-id', resourceId: 'resource-id', startTime: new Date(Date.now() + 24 * 3600000), endTime: new Date(Date.now() + 48 * 3600000) }];
    req.params = { userId: 'user-id' };
    (bookingService.findByUser as jest.Mock).mockResolvedValue(bookings);

    await bookingController.getBookingsByUser(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(sendMock).toHaveBeenCalledWith(bookings);
  });
});
