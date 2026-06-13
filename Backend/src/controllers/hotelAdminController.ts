import { Request,Response,NextFunction } from "express";
import * as hotelAdminService from '../services/hotelAdminService.js';

export const dashboard=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data=await hotelAdminService.hotelDashboard(req.query,req.user);
        return res.status(200).json({
        success: true,
        message: 'Dashboard summary fetched successfully.',
        data,
        });
    } catch (err) {
        next(err)
    }
}

export const updateRoomType=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const id=req.params.id as string;
        const data=await hotelAdminService.roomTypeUpdate(id,req.body,req.user)
        return res.status(200).json({
        success: true,
        message: 'Hotel room type updated successfully .',
        data,
        });
    } catch (err) {
        next(err)
    }
}

export const updateInventory=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data=await hotelAdminService.inventoryUpdate(req.body,req.user)
        return res.status(200).json({
        success: true,
        message: 'Inventory updated successfully.',
        data,
        });
    } catch (err) {
        next(err)
    }
}


export const updateRates=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data=await hotelAdminService.ratesUpdate(req.body,req.user)
        return res.status(200).json({
        success: true,
        message: 'Hotel Room Rates Updated.',
        data,
        });
    } catch (err) {
        next(err)
    }
}

export const hotelBooking=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data=await hotelAdminService.bookings(req.query,req.user);
        return res.status(200).json({
        success: true,
        message: 'All bookings details fetched.',
        data,
        });
    } catch (err) {
        next(err)
    }
}

export const walkInBooking=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data=await hotelAdminService.bookingsWalkin(req.body,req.user);
        return res.status(201).json({
        success: true,
        message: "Walk in Booking completed.",
        data,
        });
    } catch (err) {
        next(err)
    }
}

export const updateBookingStatus=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const id=req.params.id as string;
        const data=await hotelAdminService.bookingStatusUpdate(id,req.body,req.user);
        return res.status(200).json({
        success: true,
        message: 'Booking status updated successfully.',
        data,
        });
    } catch (err) {
        next(err)
    }
}

export const stayflexiConnect=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data=await hotelAdminService.connectStayFlexi(req.body,req.user);
        return res.status(201).json({
        success: true,
        message: 'StayFlexi connected successfully .',
        data,
        });
    } catch (err) {
        next(err)
    }
}

export const stayflexiSync=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data=await hotelAdminService.syncStayflexi(req.body,req.user);
        return res.status(200).json({
        success: true,
        message: 'Stayflexi sync successfully.',
        data,
        });
    } catch (err) {
        next(err)
    }
}

export const generateReport=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const type=req.params.type as string;
        const data=await hotelAdminService.specificReport(type,req.query,req.user);
        return res.status(200).json({
        success: true,
        message: 'Specific Report fetched successfully.',
        data,
        });
    } catch (err) {
        next(err)
    }
}


