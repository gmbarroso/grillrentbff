import { Request, Response } from 'express';
import { RegisterUserDto, LoginUserDto, UpdateUserProfileDto } from '../dtos/userDto';
import { registerUserSchema, loginUserSchema, updateUserProfileSchema } from '../validators/userValidator';
import userService from '../services/userService';

interface ExtendedRequest extends Request {
  user?: {
    name: string;
    sub: string;
  };
}

class UserController {
  async register(req: Request, res: Response): Promise<void> {
    const { error } = registerUserSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }

    const userData: RegisterUserDto = req.body;
    try {
      const user = await userService.register(userData);
      res.status(201).send({ message: 'User registered successfully', user });
    } catch (err) {
      res.status(409).send({ message: (err as Error).message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const { error } = loginUserSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }

    const loginData: LoginUserDto = req.body;
    try {
      const result = await userService.login(loginData);
      res.status(200).send(result);
    } catch (err) {
      res.status(401).send({ message: (err as Error).message });
    }
  }

  async getProfile(req: ExtendedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).send({ message: 'Unauthorized' });
        return;
      }
      const result = await userService.getProfile(req.user.sub);
      res.status(200).send(result);
    } catch (err) {
      res.status(401).send({ message: (err as Error).message });
    }
  }

  async updateProfile(req: ExtendedRequest, res: Response): Promise<void> {
    const { error } = updateUserProfileSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }

    const updateData: UpdateUserProfileDto = req.body;
    try {
      if (!req.user) {
        res.status(401).send({ message: 'Unauthorized' });
        return;
      }
      const result = await userService.updateProfile(req.user.sub, updateData);
      res.status(200).send(result);
    } catch (err) {
      res.status(401).send({ message: (err as Error).message });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    const result = await userService.getAllUsers();
    res.status(200).send(result);
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const result = await userService.remove(req.params.id);
      res.status(200).send(result);
    } catch (err) {
      res.status(404).send({ message: (err as Error).message });
    }
  }
}

export default new UserController();
