import userService from '../userService';
import { RegisterUserDto, LoginUserDto } from '../../dtos/userDto';
import { ConflictException, UnauthorizedException, NotFoundException, BadRequestException } from '../../exceptions';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('UserService', () => {
  beforeEach(() => {
    // Limpar os usuários antes de cada teste
    (userService as any).users = [];
  });

  it('should register a new user', async () => {
    const registerUserDto: RegisterUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      apartment: '101',
      password: 'password123',
      block: 1
    };

    const user = await userService.register(registerUserDto);

    expect(user).toHaveProperty('id');
    expect(user.name).toBe(registerUserDto.name);
    expect(user.email).toBe(registerUserDto.email);
    expect(user.apartment).toBe(registerUserDto.apartment);
    expect(await bcrypt.compare(registerUserDto.password, user.password)).toBe(true);
  });

  it('should not register a user with an existing email', async () => {
    const registerUserDto: RegisterUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      apartment: '101',
      password: 'password123',
      block: 1
    };

    await userService.register(registerUserDto);

    await expect(userService.register(registerUserDto)).rejects.toThrow(ConflictException);
  });

  it('should login a user with valid credentials', async () => {
    const registerUserDto: RegisterUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      apartment: '101',
      password: 'password123',
      block: 1
    };

    await userService.register(registerUserDto);

    const loginUserDto: LoginUserDto = {
      apartment: '101',
      block: 1,
      password: 'password123'
    };

    const result = await userService.login(loginUserDto);

    expect(result).toHaveProperty('token');
    const decoded = jwt.verify(result.token, process.env.JWT_SECRET || 'defaultSecret') as { name: string; sub: string };
    expect(decoded.name).toBe(registerUserDto.name);
    expect(decoded.sub).toBe(result.user.id);
  });

  it('should not login a user with invalid credentials', async () => {
    const loginUserDto: LoginUserDto = {
      apartment: '101',
      block: 1,
      password: 'wrongpassword'
    };

    await expect(userService.login(loginUserDto)).rejects.toThrow(UnauthorizedException);
  });

  it('should get user profile', async () => {
    const registerUserDto: RegisterUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      apartment: '101',
      password: 'password123',
      block: 1
    };

    const user = await userService.register(registerUserDto);

    const result = await userService.getProfile(user.id);

    expect(result.user).toEqual(user);
  });

  it('should update user profile', async () => {
    const registerUserDto: RegisterUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      apartment: '101',
      password: 'password123',
      block: 1
    };

    const user = await userService.register(registerUserDto);

    const updateUserProfileDto = {
      name: 'John Doe Updated',
      apartment: '102'
    };

    const result = await userService.updateProfile(user.id, updateUserProfileDto);

    expect(result.user.name).toBe(updateUserProfileDto.name);
    expect(result.user.apartment).toBe(updateUserProfileDto.apartment);
  });

  it('should get all users', async () => {
    const registerUserDto: RegisterUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      apartment: '101',
      password: 'password123',
      block: 1
    };

    await userService.register(registerUserDto);

    const result = await userService.getAllUsers();

    expect(result.users.length).toBe(1);
    expect(result.users[0].email).toBe(registerUserDto.email);
  });

  it('should remove a user', async () => {
    const registerUserDto: RegisterUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      apartment: '101',
      password: 'password123',
      block: 1
    };

    const user = await userService.register(registerUserDto);

    const result = await userService.remove(user.id);

    expect(result.message).toBe('User removed successfully');
    expect((userService as any).users.length).toBe(0);
  });

  it('should not remove a non-existent user', async () => {
    await expect(userService.remove('non-existent-id')).rejects.toThrow(NotFoundException);
  });
});
