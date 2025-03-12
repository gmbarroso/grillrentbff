import bookingService from '../bookingService';
import { CreateBookingDto } from '../../dtos/bookingDto';
import { BadRequestException, NotFoundException, UnauthorizedException } from '../../exceptions';

describe('BookingService', () => {
  beforeEach(() => {
    // Limpar os bookings antes de cada teste
    (bookingService as any).bookings = [];
  });

  it('should create a new booking', async () => {
    const bookingData: CreateBookingDto = {
      resourceId: 'resource-id',
      userId: 'user-id',
      startTime: new Date(Date.now() + 24 * 3600000).toISOString(),
      endTime: new Date(Date.now() + 48 * 3600000).toISOString(),
      needTablesAndChairs: false
    };

    const result = await bookingService.create(bookingData, 'user-id');

    expect(result).toHaveProperty('message', 'Booking created successfully');
    expect(result.booking).toHaveProperty('id');
    expect(result.booking.resourceId).toBe(bookingData.resourceId);
  });

  it('should not create a booking for today or a past date', async () => {
    const bookingData: CreateBookingDto = {
      resourceId: 'resource-id',
      userId: 'user-id',
      startTime: new Date(Date.now() + 12 * 3600000).toISOString(),
      endTime: new Date(Date.now() + 24 * 3600000).toISOString(),
      needTablesAndChairs: false
    };

    await expect(bookingService.create(bookingData, 'user-id')).rejects.toThrow(BadRequestException);
  });

  it('should check availability of a resource', async () => {
    const bookingData: CreateBookingDto = {
      resourceId: 'resource-id',
      userId: 'user-id',
      startTime: new Date(Date.now() + 24 * 3600000).toISOString(),
      endTime: new Date(Date.now() + 48 * 3600000).toISOString(),
      needTablesAndChairs: false
    };

    await bookingService.create(bookingData, 'user-id');

    const result = await bookingService.checkAvailability('resource-id', new Date(Date.now() + 24 * 3600000), new Date(Date.now() + 48 * 3600000), 'user-id');

    expect(result.available).toBe(false);
  });

  it('should find bookings by user', async () => {
    const bookingData: CreateBookingDto = {
      resourceId: 'resource-id',
      userId: 'user-id',
      startTime: new Date(Date.now() + 24 * 3600000).toISOString(),
      endTime: new Date(Date.now() + 48 * 3600000).toISOString(),
      needTablesAndChairs: false
    };

    await bookingService.create(bookingData, 'user-id');

    const result = await bookingService.findByUser('user-id', 'user-id');

    expect(result.length).toBe(1);
    expect(result[0].resourceId).toBe(bookingData.resourceId);
  });

  it('should find all bookings', async () => {
    const bookingData: CreateBookingDto = {
      resourceId: 'resource-id',
      userId: 'user-id',
      startTime: new Date(Date.now() + 24 * 3600000).toISOString(),
      endTime: new Date(Date.now() + 48 * 3600000).toISOString(),
      needTablesAndChairs: false
    };

    await bookingService.create(bookingData, 'user-id');

    const result = await bookingService.findAll('user-id');

    expect(result.length).toBe(1);
    expect(result[0].resourceId).toBe(bookingData.resourceId);
  });

  it('should remove a booking', async () => {
    const bookingData: CreateBookingDto = {
      resourceId: 'resource-id',
      userId: 'user-id',
      startTime: new Date(Date.now() + 24 * 3600000).toISOString(),
      endTime: new Date(Date.now() + 48 * 3600000).toISOString(),
      needTablesAndChairs: false
    };

    const booking = await bookingService.create(bookingData, 'user-id');

    const result = await bookingService.remove(booking.booking.id, 'user-id');

    expect(result.message).toBe('Booking removed successfully');
    expect((bookingService as any).bookings.length).toBe(0);
  });

  it('should not remove a non-existent booking', async () => {
    await expect(bookingService.remove('non-existent-id', 'user-id')).rejects.toThrow(NotFoundException);
  });
});
