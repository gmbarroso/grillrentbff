import axios from 'axios';
import { CreateBookingDto } from '../dtos/bookingDto';
import { NotFoundException, BadRequestException } from '../exceptions';
import { Booking } from '../entities/booking';
import { User } from '../entities/user';
import { Resource } from '../entities/resource';
import { API_URL, USE_MOCKS } from '../config';

class BookingService {
  private bookings: Booking[] = [];
  private users: User[] = [{ id: 'user-id', name: 'John Doe', email: 'john@example.com', password: 'password123', apartment: '101', block: 1, role: 'resident'}];
  private resources: Resource[] = [{ id: 'resource-id', name: 'Resource 1', description: 'Example description' }];
  private apiUrl = API_URL;

  async create(createBookingDto: CreateBookingDto, token: string) {
    if (USE_MOCKS) {
      const { resourceId, startTime, endTime } = createBookingDto;

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      if (new Date(startTime) <= currentDate) {
        throw new BadRequestException('Cannot create booking for today or a past date');
      }

      const isAvailable = await this.checkAvailability(resourceId, new Date(startTime), new Date(endTime));

      if (!isAvailable.available) {
        throw new BadRequestException(isAvailable.message);
      }

      const resource = this.resources.find(resource => resource.id === resourceId);
      if (!resource) {
        throw new BadRequestException('Resource not found');
      }

      const user = this.users.find(user => user.id === token);
      if (!user) {
        throw new BadRequestException('Invalid user');
      }

      const booking = { id: this.generateId(), ...createBookingDto, user, resource, startTime: new Date(startTime), endTime: new Date(endTime) };
      this.bookings.push(booking);
      return { message: 'Booking created successfully', booking };
    } else {
      try {
        const response = await axios.post(`${this.apiUrl}/bookings`, createBookingDto, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 400) {
          throw new BadRequestException(error.response.data.message);
        }
        throw error;
      }
    }
  }

  async checkAvailability(resourceId: string, startTime: Date, endTime: Date) {
    if (USE_MOCKS) {
      const overlappingBookings = this.bookings.filter(
        booking =>
          booking.resourceId === resourceId &&
          ((new Date(booking.startTime) < endTime && new Date(booking.startTime) >= startTime) ||
            (new Date(booking.endTime) > startTime && new Date(booking.endTime) <= endTime))
      );

      return { 
        available: overlappingBookings.length === 0,
        message: overlappingBookings.length === 0 ? 'Resource is available' : 'Resource is not available'
      };
    } else {
      try {
        const response = await axios.post(`${this.apiUrl}/bookings/check-availability`, {
          resourceId,
          startTime,
          endTime
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  }

  async findByUser(userId: string, token: string) {
    if (USE_MOCKS) {
      return this.bookings.filter(booking => booking.user.id === userId);
    } else {
      try {
        const response = await axios.get(`${this.apiUrl}/bookings/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  }

  async findAll() {
    if (USE_MOCKS) {
      return this.bookings;
    } else {
      try {
        const response = await axios.get(`${this.apiUrl}/bookings`);
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  }

  async remove(bookingId: string, token: string) {
    if (USE_MOCKS) {
      const bookingIndex = this.bookings.findIndex(booking => booking.id === bookingId);
      if (bookingIndex === -1) {
        throw new NotFoundException('Booking not found');
      }
      this.bookings.splice(bookingIndex, 1);
      return { message: 'Booking removed successfully' };
    } else {
      try {
        const response = await axios.delete(`${this.apiUrl}/bookings/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
          throw new NotFoundException(error.response.data.message);
        }
        throw error;
      }
    }
  }

  private generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

export default new BookingService();
