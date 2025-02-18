import { Router, Request, Response, NextFunction } from 'express';
import userController from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

// Helper para lidar com funções assíncronas
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Rotas de usuários
router.post('/users/register', asyncHandler(async (req: Request, res: Response) => userController.register(req, res)));
router.post('/users/login', asyncHandler(async (req: Request, res: Response) => userController.login(req, res)));
router.get('/users/profile', authMiddleware, asyncHandler(async (req: Request, res: Response) => userController.getProfile(req, res)));
router.put('/users/profile', authMiddleware, asyncHandler(async (req: Request, res: Response) => userController.updateProfile(req, res)));
router.get('/users', authMiddleware, asyncHandler(async (req: Request, res: Response) => userController.getAllUsers(req, res)));
router.delete('/users/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => userController.deleteUser(req, res)));

export default router;
