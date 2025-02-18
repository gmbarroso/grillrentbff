import { Request, Response } from 'express';
import { RegisterUserDto, LoginUserDto, UpdateUserProfileDto } from '../dtos/userDto';
import { registerUserSchema, loginUserSchema, updateUserProfileSchema } from '../validators/userValidator';
import userService from '../services/userService';

class UserController {
  /**
   * @swagger
   * /users/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterUserDto'
   *     responses:
   *       201:
   *         description: User registered successfully
   *       400:
   *         description: Validation error
   *       409:
   *         description: Conflict error
   */
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

  /**
   * @swagger
   * /users/login:
   *   post:
   *     summary: Login a user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginUserDto'
   *     responses:
   *       200:
   *         description: User logged in successfully
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized error
   */
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

  /**
   * @swagger
   * /users/profile:
   *   get:
   *     summary: Get user profile
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile retrieved successfully
   *       401:
   *         description: Unauthorized error
   */
  async getProfile(req: Request, res: Response): Promise<void> {
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

  /**
   * @swagger
   * /users/profile:
   *   put:
   *     summary: Update user profile
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateUserProfileDto'
   *     responses:
   *       200:
   *         description: User profile updated successfully
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized error
   */
  async updateProfile(req: Request, res: Response): Promise<void> {
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

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Get all users
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: All users retrieved successfully
   *       401:
   *         description: Unauthorized error
   */
  async getAllUsers(req: Request, res: Response): Promise<void> {
    const result = await userService.getAllUsers();
    res.status(200).send(result);
  }

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     summary: Delete a user
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: User deleted successfully
   *       404:
   *         description: Not found error
   */
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
