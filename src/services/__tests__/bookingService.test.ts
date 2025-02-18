import bookingService from '../bookingService';
import { CreateBookingDto } from '../../dtos/bookingDto';
import { BadRequestException, NotFoundException } from '../../exceptions';

describe('BookingService', () => {
  beforeEach(() => {
    (bookingService as any).bookings = [];
    (bookingService as any).users = [];
    (bookingService as any).resources = [];
  });

  it('should create a new booking', async () => {
    const bookingData: CreateBookingDto = {
      resourceId: 'resource-id',
      userId: 'user-id',
      startTime: new Date(Date.now() + 24 * 3600000).toISOString(),
      endTime: new Date(Date.now() + 48 * 3600000).toISOString(),
    };

    (bookingService as any).users.push({ id: 'user-id', name: 'John Doe' });
    (bookingService as any).resources.push({ id: 'resource-id', name: 'Resource 1' });

    const booking = await bookingService.create(bookingData, 'user-id');
    expect(booking).toHaveProperty('id');
    expect(booking.booking.resourceId).toBe(bookingData.resourceId);
  });

  it('should not create a booking for a past date', async () => {
    const bookingData: CreateBookingDto = {
      resourceId: 'resource-id',
      userId: 'user-id',
      startTime: new Date(Date.now() - 24 * 3600000).toISOString(),
      endTime: new Date().toISOString(),
    };

    await expect(bookingService.create(bookingData, 'user-id')).rejects.toThrow(BadRequestException);
  });

  it('should check availability of a resource', async () => {
    const bookingData: CreateBookingDto = {
      resourceId: 'resource-id',
      userId: 'user-id',
      startTime: new Date(Date.now() + 24 * 3600000).toISOString(),
      endTime: new Date(Date.now() + 48 * 3600000).toISOString(),
    };

    (bookingService as any).bookings.push({ ...bookingData, id: 'booking-id', user: { id: 'user-id', name: 'John Doe' }, resource: { id: 'resource-id', name: 'Resource 1' } });

    const availability = await bookingService.checkAvailability('resource-id', new Date(Date.now() + 24 * 3600000), new Date(Date.now() + 48 * 3600000));
    expect(availability.available).toBe(false);
  });
});
