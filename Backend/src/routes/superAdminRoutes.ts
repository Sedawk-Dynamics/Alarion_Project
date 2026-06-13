import { Router } from 'express';
import * as superAdminController from '../controllers/superAdminController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const route=Router();

route.post('/hotels',authenticate,requireRole('super_admin'),superAdminController.onboardHotel);
route.put('/hotels/:id',authenticate,requireRole('super_admin'),superAdminController.updateDetails);
route.get('/analytics/dashboard',authenticate,requireRole('super_admin'),superAdminController.dashboard);
route.get('/bookings',authenticate,requireRole('super_admin'),superAdminController.allBookings);
route.get('/users',authenticate,requireRole('super_admin'),superAdminController.allUsers);
route.get('/revenue',authenticate,requireRole('super_admin'),superAdminController.revAnalytics);


export default route;