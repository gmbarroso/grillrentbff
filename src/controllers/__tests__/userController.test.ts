import { Request, Response } from 'express';
import userController from '../userController';
import userService from '../../services/userService';
import { RegisterUserDto, LoginUserDto } from '../../dtos/userDto';

jest.mock('../../services/userService');

describe('UserController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    req = {};
    statusMock = jest.fn().mockReturnThis();
    sendMock = jest.fn().mockReturnThis();
    res = {
      status: statusMock,
      send: sendMock,
    };
  });

  it('should register a new user', async () => {
    const userData: RegisterUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      apartment: '101',
      block: 1,
    };

    req.body = userData;
    (userService.register as jest.Mock).mockResolvedValue(userData);

    await userController.register(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(sendMock).toHaveBeenCalledWith(userData);
  });

  it('should login a user', async () => {
    const loginData: LoginUserDto = {
      apartment: '101',
      block: 1,
      password: 'password123',
    };

    req.body = loginData;
    const result = { message: 'User logged in successfully', user: { id: 'user-id', name: 'John Doe' } };
    (userService.login as jest.Mock).mockResolvedValue(result);

    await userController.login(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(sendMock).toHaveBeenCalledWith(result);
  });

  it('should get user profile', async () => {
    const userId = 'user-id';
    req.user = { sub: userId, name: 'John Doe' };
    const userProfile = { id: userId, name: 'John Doe', email: 'john@example.com' };
    (userService.getProfile as jest.Mock).mockResolvedValue(userProfile);

    await userController.getProfile(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(sendMock).toHaveBeenCalledWith(userProfile);
  });
});
