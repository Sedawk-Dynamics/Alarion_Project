import { Router } from 'express';
import * as hotelAdminController from '../controllers/hotelAdminController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const route=Router()

// every hotel-admin route: must be logged in AND a hotel admin
route.use(authenticate, requireRole('hotel_admin'));

route.get('/dashboard',hotelAdminController.dashboard);
route.put('/rooms/:id',hotelAdminController.updateRoomType);
route.put('/inventory',hotelAdminController.updateInventory);
route.put('/rates',hotelAdminController.updateRates);
route.get('/bookings',hotelAdminController.hotelBooking);
route.post('/bookings/walkin', hotelAdminController.walkInBooking);
route.put('/bookings/:id/status', hotelAdminController.updateBookingStatus);
route.post('/stayflexi/connect', hotelAdminController.stayflexiConnect);
route.post('/stayflexi/sync', hotelAdminController.stayflexiSync);
route.get('/reports/:type', hotelAdminController.generateReport);

export default route;