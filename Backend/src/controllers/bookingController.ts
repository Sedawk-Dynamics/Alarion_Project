import { Request,Response,NextFunction } from "express";
import * as bookingService from '../services/bookingService.js'

export const createBooking=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data=await bookingService.addBooking(req.body,req.user);
        return res.status(200).json({
        success: true,
        message: 'Booking created successfully.',
        data,
        });
    } catch (err) {
        next(err)
    }
}

export const bookingDetails=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const id=req.params.id as string;
        const data=await bookingService.detailsBooking(id,req.user)
        return res.status(200).json({
        success: true,
        message: 'Booking Details Fetched successfully.',
        data,
        });
    } catch (err) {
        next(err)
    }
}

export const userBookings=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data=await bookingService.bookingsUser(req.user);
        return res.status(200).json({
        success: true,
        message: 'User Booking  Fetched successfully.',
        data,
        });
    } catch (err) {
        next(err)
    }
}

export const cancelBooking=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const id=req.params.id as string
        const data=await bookingService.bookingCancel(id,req.body,req.user);
        return res.status(200).json({
        success: true,
        message: 'Booking Cancelled successfully.',
        data,
        });
    } catch (err) {
        next(err)
    }
}

export const roomAvailability=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data=await bookingService.checkAvailability(req.body,req.user);
        return res.status(200).json({
        success: true,
        message: 'Booking availabilty fetched successfully.',
        data,
        });
    } catch (err) {
        next(err)
    }
}