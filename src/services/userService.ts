import { RegisterUserDto, LoginUserDto, UpdateUserProfileDto } from '../dtos/userDto';
import { ConflictException, UnauthorizedException, NotFoundException } from '../exceptions';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserService {
  private users: any[] = []; // Simulação de um banco de dados

  async register(createUserDto: RegisterUserDto) {
    const { name, email, apartment, password } = createUserDto;

    // Verificar se o name, email ou apartment já existem
    const existingUser = this.users.find(user => user.name === name || user.email === email || user.apartment === apartment);

    if (existingUser) {
      throw new ConflictException('Name, email or apartment already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: this.generateId(), ...createUserDto, password: hashedPassword };
    this.users.push(user);
    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = this.users.find(user => user.email === loginUserDto.email);
    if (!user || !(await bcrypt.compare(loginUserDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { name: user.name, sub: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'defaultSecret');
    return { message: 'User logged in successfully', token };
  }

  async getProfile(userId: string) {
    const user = this.users.find(user => user.id === userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { message: 'User profile retrieved successfully', user };
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserProfileDto) {
    const user = this.users.find(user => user.id === userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    Object.assign(user, updateUserDto);
    return { message: 'User profile updated successfully', user };
  }

  async getAllUsers() {
    return { message: 'All users retrieved successfully', users: this.users };
  }

  async remove(userId: string) {
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }
    this.users.splice(userIndex, 1);
    return { message: 'User removed successfully' };
  }

  private generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

export default new UserService();
