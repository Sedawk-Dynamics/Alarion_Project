import { Router } from 'express';
import authRoute from './authRoute.js';
import hotelSearchRoute from './hotelSearchRoute.js';
import superAdminRoute from './superAdminRoutes.js';
import hotelAdminRoute from './hotelAdminRoutes.js';
import bookingRoute from './bookingRoute.js';
import paymentRoute from './paymentRoute.js';

const router = Router();

router.use('/auth',authRoute);
router.use('/',hotelSearchRoute);
router.use('/admin',superAdminRoute);
router.use('/hotel',hotelAdminRoute);
router.use('/bookings',bookingRoute);
router.use('/payments',paymentRoute);

export default router;
