import userService from '../userService';
import { RegisterUserDto, LoginUserDto } from '../../dtos/userDto';
import { ConflictException, UnauthorizedException } from '../../exceptions';

describe('UserService', () => {
  beforeEach(() => {
    // Limpar o estado antes de cada teste
    (userService as any).users = [];
  });

  it('should register a new user', async () => {
    const userData: RegisterUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      apartment: '101',
    };

    const user = await userService.register(userData);
    expect(user).toHaveProperty('id');
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
  });

  it('should not register a user with an existing email', async () => {
    const userData: RegisterUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      apartment: '101',
    };

    await userService.register(userData);

    await expect(userService.register(userData)).rejects.toThrow(ConflictException);
  });

  it('should login a user with valid credentials', async () => {
    const userData: RegisterUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      apartment: '101',
    };

    await userService.register(userData);

    const loginData: LoginUserDto = {
      email: 'john@example.com',
      password: 'password123',
    };

    const result = await userService.login(loginData);
    expect(result).toHaveProperty('token');
  });

  it('should not login a user with invalid credentials', async () => {
    const userData: RegisterUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      apartment: '101',
    };

    await userService.register(userData);

    const loginData: LoginUserDto = {
      email: 'john@example.com',
      password: 'wrongpassword',
    };

    await expect(userService.login(loginData)).rejects.toThrow(UnauthorizedException);
  });
});
