import {Router} from 'express'
import * as paymentController from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const route=Router();

// These need a logged-in user
route.post('/create-order',authenticate,paymentController.createRazorpayOrder)
route.post('/verify',authenticate,paymentController.verifyPayment)
route.post("/:id/refund",authenticate,paymentController.initiateRefund);

// Webhook is called by Razorpay (no JWT) — verified by SIGNATURE, not auth. Keep it public.
route.post('/webhook',paymentController.handleWebhook);

export default route;