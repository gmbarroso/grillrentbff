import { Router, Request, Response, NextFunction } from 'express';
import userController from '../controllers/userController';
import bookingController from '../controllers/bookingController';
import resourceController from '../controllers/resourceController';

const router = Router();

// Helper para lidar com funções assíncronas
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Rotas de usuários
router.post('/users/register', asyncHandler(async (req: Request, res: Response) => {
  console.log('Route /users called');
  return userController.register(req, res)
}));
router.post('/users/login', asyncHandler(async (req: Request, res: Response) => {
  console.log('Route /users called');
  return userController.login(req, res)
}));
router.post('/users/logout', asyncHandler(async (req: Request, res: Response) => {
  console.log('Route /users/logout called');
  return userController.logout(req, res)
}));
router.get('/users/profile', asyncHandler(async (req: Request, res: Response) => userController.getProfile(req, res)));
router.put('/users/profile', asyncHandler(async (req: Request, res: Response) => userController.updateProfile(req, res)));
router.get('/users', asyncHandler(async (req: Request, res: Response) => userController.getAllUsers(req, res)));
router.delete('/users/:id', asyncHandler(async (req: Request, res: Response) => userController.deleteUser(req, res)));

// Rotas de bookings
router.post('/bookings', asyncHandler(async (req: Request, res: Response) => {
  console.log('Route /bookings called');
  return bookingController.createBooking(req, res);
}));
router.get('/bookings', asyncHandler(async (req: Request, res: Response) => bookingController.getAllBookings(req, res)));
router.get('/bookings/user/:userId', asyncHandler(async (req: Request, res: Response) => bookingController.getBookingsByUser(req, res)));
router.delete('/bookings/:id', asyncHandler(async (req: Request, res: Response) => bookingController.deleteBooking(req, res)));
router.get('/bookings/availability/:resourceId', asyncHandler(async (req: Request, res: Response) => bookingController.availability(req, res)));

// Rota de recursos
router.get('/resources', asyncHandler(async (req: Request, res: Response) => resourceController.getResource(req, res)));

export default router;
