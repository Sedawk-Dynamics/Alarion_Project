import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import * as bookingController from '../controllers/bookingController.js';
const route=Router();

// booking endpoints just need a logged-in user (any role) — PRD §5.4.2
route.use(authenticate);

route.post('/',bookingController.createBooking);
route.post("/check-availability",bookingController.roomAvailability);
// static '/my' MUST come before the dynamic '/:id', else '/my' is captured as id="my"
route.get('/my',bookingController.userBookings);
route.get('/:id',bookingController.bookingDetails);
route.post('/:id/cancel',bookingController.cancelBooking);

export default route;
