import axios from 'axios';
import { CreateBookingDto } from '../dtos/bookingDto';
import { API_URL, USE_MOCKS } from '../config';
import { UnauthorizedException, NotFoundException, BadRequestException } from '../exceptions';

class BookingService {
  private bookings: any[] = []; // Simulação de um banco de dados
  private apiUrl = API_URL;

  async create(createBookingDto: CreateBookingDto, token: string) {
    console.log('Creating booking:', createBookingDto);
    console.log('USE_MOCKS:', USE_MOCKS);
    if (USE_MOCKS) {
      const booking = { id: this.generateId(), ...createBookingDto };
      this.bookings.push(booking);
      console.log('Booking created in mock DB:', booking);
      return booking;
    } else {
      try {
        const response = await axios.post(`${this.apiUrl}/bookings`, createBookingDto, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('API response:', response.data);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('API error:', error.response?.data);
          if (error.response && error.response.status === 401) {
            throw new UnauthorizedException(error.response.data.message);
          }
          if (error.response && error.response.status === 400) {
            throw new BadRequestException(error.response.data.message);
          }
        }
        throw error;
      }
    }
  }

  async findAll(token: string, page: number = 1, limit: number = 10, sort: string = 'startTime', order: 'ASC' | 'DESC' = 'ASC') {
    console.log('Getting all bookings with pagination and sorting');
    console.log('USE_MOCKS:', USE_MOCKS);
    if (USE_MOCKS) {
      return { message: 'All bookings retrieved successfully', bookings: this.bookings };
    } else {
      try {
        const response = await axios.get(`${this.apiUrl}/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { page, limit, sort, order }
        });
        console.log('API response:', response.data);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('API error:', error.response?.data);
          if (error.response && error.response.status === 401) {
            throw new UnauthorizedException(error.response.data.message);
          }
        }
        throw error;
      }
    }
  }

  async findByUser(userId: string, token: string, page: number = 1, limit: number = 10, sort: string = 'startTime', order: 'ASC' | 'DESC' = 'ASC') {
    console.log('Getting bookings for user with pagination and sorting:', userId);
    console.log('USE_MOCKS:', USE_MOCKS);
    if (USE_MOCKS) {
      const userBookings = this.bookings.filter(booking => booking.userId === userId);
      return { message: 'User bookings retrieved successfully', bookings: userBookings };
    } else {
      try {
        const response = await axios.get(`${this.apiUrl}/bookings/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { page, limit, sort, order }
        });
        console.log('API response:', response.data);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('API error:', error.response?.data);
          if (error.response && error.response.status === 401) {
            throw new UnauthorizedException(error.response.data.message);
          }
          if (error.response && error.response.status === 404) {
            throw new NotFoundException(error.response.data.message);
          }
        }
        throw error;
      }
    }
  }

  async remove(bookingId: string, token: string) {
    console.log('Removing booking with id:', bookingId);
    console.log('USE_MOCKS:', USE_MOCKS);
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
        console.log('API response:', response.data);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('API error:', error.response?.data);
          if (error.response && error.response.status === 404) {
            throw new NotFoundException(error.response.data.message);
          }
          if (error.response && error.response.status === 401) {
            throw new UnauthorizedException(error.response.data.message);
          }
        }
        throw error;
      }
    }
  }

  async checkAvailability(resourceId: string, startTime: Date, endTime: Date, token: string) {
    console.log('Checking availability for resource:', resourceId);
    console.log('USE_MOCKS:', USE_MOCKS);
    if (USE_MOCKS) {
      const isAvailable = !this.bookings.some(booking => booking.resourceId === resourceId && (
        (startTime >= new Date(booking.startTime) && startTime < new Date(booking.endTime)) ||
        (endTime > new Date(booking.startTime) && endTime <= new Date(booking.endTime))
      ));
      return { message: 'Availability checked successfully', isAvailable };
    } else {
      try {
        const response = await axios.get(`${this.apiUrl}/bookings/availability/${resourceId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { startTime, endTime }
        });
        console.log('API response:', response.data);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('API error:', error.response?.data);
          if (error.response && error.response.status === 400) {
            throw new BadRequestException(error.response.data.message);
          }
          if (error.response && error.response.status === 401) {
            throw new UnauthorizedException(error.response.data.message);
          }
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
