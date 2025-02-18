import { CreateBookingDto } from '../dtos/bookingDto';
import { NotFoundException, BadRequestException } from '../exceptions';
import { Booking } from '../entities/booking';
import { User } from '../entities/user';
import { Resource } from '../entities/resource';

class BookingService {
  private bookings: Booking[] = []; // Simulação de um banco de dados
  private users: User[] = []; // Simulação de um banco de dados de usuários
  private resources: Resource[] = []; // Simulação de um banco de dados de recursos

  async create(createBookingDto: CreateBookingDto, userId: string) {
    const { resourceId, startTime, endTime } = createBookingDto;

    // Verificar se a reserva está sendo feita para dias futuros
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Zerar horas, minutos, segundos e milissegundos
    if (new Date(startTime) <= currentDate) {
      throw new BadRequestException('Cannot create booking for today or a past date');
    }

    // Verificar disponibilidade
    const isAvailable = await this.checkAvailability(resourceId, new Date(startTime), new Date(endTime));

    if (!isAvailable.available) {
      throw new BadRequestException(isAvailable.message);
    }

    // Verificar se o recurso existe
    const resource = this.resources.find(resource => resource.id === resourceId);
    if (!resource) {
      throw new BadRequestException('Resource not found');
    }

    const user = this.users.find(user => user.id === userId);
    if (!user) {
      throw new BadRequestException('Invalid user');
    }

    const booking = { id: this.generateId(), ...createBookingDto, user, resource, startTime: new Date(startTime), endTime: new Date(endTime) };
    this.bookings.push(booking);
    return { message: 'Booking created successfully', booking };
  }

  async checkAvailability(resourceId: string, startTime: Date, endTime: Date) {
    const existingBookings = this.bookings.filter(
      booking => booking.resourceId === resourceId && booking.startTime <= endTime && booking.endTime >= startTime
    );

    if (existingBookings.length > 0) {
      const existingBooking = existingBookings[0];
      return { available: false, message: `Resource is already booked by apartment ${existingBooking.user.apartment} at the specified time` };
    }

    return { available: true, message: 'Available' };
  }

  async findByUser(userId: string) {
    return this.bookings.filter(booking => booking.user.id === userId);
  }

  async findAll() {
    return this.bookings;
  }

  async remove(bookingId: string) {
    const bookingIndex = this.bookings.findIndex(booking => booking.id === bookingId);
    if (bookingIndex === -1) {
      throw new NotFoundException('Booking not found');
    }
    this.bookings.splice(bookingIndex, 1);
    return { message: 'Booking removed successfully' };
  }

  private generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

export default new BookingService();
