import { Request, Response } from 'express';
import { UserRequest } from '../types/express';
import { RegisterUserDto, LoginUserDto, UpdateUserProfileDto } from '../dtos/userDto';
import { registerUserSchema, loginUserSchema, updateUserProfileSchema } from '../validators/userValidator';
import userService from '../services/userService';

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
      res.status(201).send(user);
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

  async getProfile(req: UserRequest, res: Response): Promise<void> {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        res.status(401).send({ message: 'Unauthorized' });
        return;
      }
      const result = await userService.getProfile(token);
      res.status(200).send(result);
    } catch (err) {
      res.status(401).send({ message: (err as Error).message });
    }
  }

  async updateProfile(req: UserRequest, res: Response): Promise<void> {
    const { error } = updateUserProfileSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }

    const updateData: UpdateUserProfileDto = req.body;
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        res.status(401).send({ message: 'Unauthorized' });
        return;
      }
      const result = await userService.updateProfile(token, updateData);
      res.status(200).send(result);
    } catch (err) {
      res.status(401).send({ message: (err as Error).message });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        res.status(401).send({ message: 'Unauthorized' });
        return;
      }
      const result = await userService.getAllUsers(token);
      res.status(200).send(result);
    } catch (err) {
      res.status(401).send({ message: (err as Error).message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        res.status(401).send({ message: 'Unauthorized' });
        return;
      }
      const result = await userService.remove(token);
      res.status(200).send(result);
    } catch (err) {
      res.status(404).send({ message: (err as Error).message });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        res.status(401).send('Unauthorized');
        return;
      }
      const result = await userService.logout(token);
      res.status(200).send(result);
    } catch (err) {
      res.status(400).send({ message: (err as Error).message });
    }
  }
}

export default new UserController();
