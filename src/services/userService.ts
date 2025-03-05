import axios from 'axios';
import { RegisterUserDto, LoginUserDto, UpdateUserProfileDto } from '../dtos/userDto';
import { ConflictException, UnauthorizedException, NotFoundException, BadRequestException } from '../exceptions';
import { API_URL, USE_MOCKS } from '../config';

class UserService {
  private users: any[] = []; // Simulação de um banco de dados
  private apiUrl = API_URL;

  async register(registerUserDto: RegisterUserDto) {
    console.log('USE_MOCKS:', USE_MOCKS);
    if (USE_MOCKS) {
      const { name, email, apartment, password, block } = registerUserDto;

      const existingUser = this.users.find(user => user.name === name || user.email === email || user.apartment === apartment);

      if (existingUser) {
        throw new ConflictException('Name, email or apartment already in use');
      }

      const user = { id: this.generateId(), ...registerUserDto };
      this.users.push(user);
      console.log('User registered in mock DB:', user);
      return user;
    } else {
      try {
        const response = await axios.post(`${this.apiUrl}/users/register`, registerUserDto);
        console.log('API response:', response.data);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('API error:', error.response?.data);
          if (error.response && error.response.status === 409) {
            throw new ConflictException(error.response.data.message);
          }
          if (error.response && error.response.status === 400) {
            throw new BadRequestException(error.response.data.message);
          }
        }
        throw error;
      }
    }
  }

  async login(loginUserDto: LoginUserDto) {
    console.log('USE_MOCKS:', USE_MOCKS);
    if (USE_MOCKS) {
      const user = this.users.find(user => user.apartment === loginUserDto.apartment);
      if (!user || user.password !== loginUserDto.password) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return { message: 'User logged in successfully', user };
    } else {
      try {
        const response = await axios.post(`${this.apiUrl}/users/login`, loginUserDto);
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

  async getProfile(token: string) {
    console.log('USE_MOCKS:', USE_MOCKS);
    if (USE_MOCKS) {
      const user = this.users.find(user => user.id === token);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return { message: 'User profile retrieved successfully', user };
    } else {
      try {
        const response = await axios.get(`${this.apiUrl}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
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

  async updateProfile(token: string, updateUserProfileDto: UpdateUserProfileDto) {
    console.log('USE_MOCKS:', USE_MOCKS);
    if (USE_MOCKS) {
      const user = this.users.find(user => user.id === token);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      Object.assign(user, updateUserProfileDto);
      return { message: 'User profile updated successfully', user };
    } else {
      try {
        const response = await axios.put(`${this.apiUrl}/users/profile`, updateUserProfileDto, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
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

  async getAllUsers(token: string) {
    console.log('Getting all users');
    console.log('USE_MOCKS:', USE_MOCKS);
    if (USE_MOCKS) {
      return { message: 'All users retrieved successfully', users: this.users };
    } else {
      try {
        const response = await axios.get(`${this.apiUrl}/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
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

  async remove(token: string) {
    console.log('USE_MOCKS:', USE_MOCKS);
    if (USE_MOCKS) {
      const userIndex = this.users.findIndex(user => user.id === token);
      if (userIndex === -1) {
        throw new NotFoundException('User not found');
      }
      this.users.splice(userIndex, 1);
      return { message: 'User removed successfully' };
    } else {
      try {
        const response = await axios.delete(`${this.apiUrl}/users/${token}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('API error:', error.response?.data);
          if (error.response && error.response.status === 404) {
            throw new NotFoundException(error.response.data.message);
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

export default new UserService();
