import { Request, Response } from 'express';
import bookingController from '../bookingController';
import bookingService from '../../services/bookingService';
import { CreateBookingDto } from '../../dtos/bookingDto';
import request from 'supertest';
import app from '../../app';

jest.mock('../../services/bookingService');

describe('BookingController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;
  let token: string;

  beforeAll(() => {
    token = 'test-token';
  });

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
      needTablesAndChairs: false
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

  it('should check availability of a resource', async () => {
    const resourceId = 'resource-id';
    const startTime = new Date(Date.now() + 24 * 3600000).toISOString();
    const endTime = new Date(Date.now() + 48 * 3600000).toISOString();

    (bookingService.checkAvailability as jest.Mock).mockResolvedValue({
      available: true,
      message: 'Available'
    });

    const response = await request(app)
      .get(`/bookings/availability/${resourceId}`)
      .query({ startTime, endTime })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      available: true,
      message: 'Available'
    });
  });

  it('should return 400 if required parameters are missing', async () => {
    const response = await request(app)
      .get('/bookings/availability/resource-id')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Missing required parameters' });
  });

  it('should return 401 if token is missing', async () => {
    const response = await request(app)
      .get('/bookings/availability/resource-id')
      .query({ startTime: new Date().toISOString(), endTime: new Date().toISOString() });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Unauthorized' });
  });

  it('should return 400 if service throws an error', async () => {
    const resourceId = 'resource-id';
    const startTime = new Date(Date.now() + 24 * 3600000).toISOString();
    const endTime = new Date(Date.now() + 48 * 3600000).toISOString();

    (bookingService.checkAvailability as jest.Mock).mockRejectedValue(new Error('Service error'));

    const response = await request(app)
      .get(`/bookings/availability/${resourceId}`)
      .query({ startTime, endTime })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Service error' });
  });
});
