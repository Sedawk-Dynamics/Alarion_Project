import { Request,Response,NextFunction } from "express";
import * as paymentService from '../services/paymentService.js';

export const createRazorpayOrder=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data=await paymentService.razorpayOrder(req.body,req.user);
        return res.status(201).json({
        success: true,
        message: 'Razorpay order created successfully.',
        data,
        });
    } catch (err) {
        next(err)
    }
}
export const verifyPayment=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data=await paymentService.paymentVerify(req.body,req.user);
        return res.status(200).json({
        success: true,
        message: 'Payment verified successfully.',
        data,
        });
    } catch (err) {
        next(err)
    }
}
export const initiateRefund=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const id=req.params.id as string;
        const data=await paymentService.refundInitiate(id,req.body,req.user);
        return res.status(201).json({
        success: true,
        message: 'Refund Initiated successfully.',
        data,
        });
    } catch (err) {
        next(err)
    }
}
export const handleWebhook=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const signature=req.headers['x-razorpay-signature'] as string;
        const data=await paymentService.webhookHandle(req.body,signature);
        return res.status(200).json({
        success: true,
        message: 'WebHook handled successfully.',
        data,
        });
    } catch (err) {
        next(err)
    }
}