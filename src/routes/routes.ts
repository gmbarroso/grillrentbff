import { Router, Request, Response, NextFunction } from 'express';
import userController from '../controllers/userController';
import bookingController from '../controllers/bookingController';
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

// Rotas de bookings
router.post('/bookings', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  console.log('Route /bookings called');
  return bookingController.createBooking(req, res);
}));
router.get('/bookings', authMiddleware, asyncHandler(async (req: Request, res: Response) => bookingController.getAllBookings(req, res)));
router.get('/bookings/user/:userId', authMiddleware, asyncHandler(async (req: Request, res: Response) => bookingController.getBookingsByUser(req, res)));
router.delete('/bookings/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => bookingController.deleteBooking(req, res)));
router.post('/bookings/check-availability', authMiddleware, asyncHandler(async (req: Request, res: Response) => bookingController.checkAvailability(req, res)));

export default router;
