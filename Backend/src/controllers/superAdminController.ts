import type { Request, Response, NextFunction } from 'express';
import * as superAdminServices from '../services/superAdminServices.js';

export const onboardHotel=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data=await superAdminServices.hotelOnboard(req.body,req.user);
        return res.status(201).json({
        success: true,
        message: 'Hotel onboarded successfully.',
        data,
        });
    } catch (err) {
        next(err)
    }
}

export const updateDetails=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const id=req.params.id as string;
        const data=await superAdminServices.detailsUpdate(id,req.body,req.user);
        return res.status(200).json({
            success: true,
            message: 'Hotel details updated successfully.',
            data,
        })
    } catch (err) {
        next(err)
    }
}

export const dashboard=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data=await superAdminServices.dashboardSummary(req.query);
        return res.status(200).json({
            success: true,
            message: 'Platform dashboard summary.',
            data,
        })
    } catch (err) {
        next(err)
    }
}

export const allBookings=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data=await superAdminServices.bookings(req.query);
        return res.status(200).json({
            success: true,
            message: 'All Booking details fetched successfully.',
            data,
        })
    } catch (err) {
        next(err)
    }
}

export const allUsers=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data=await superAdminServices.users(req.query);
        return res.status(200).json({
            success: true,
            message: 'All users fetched successfully.',
            data,
        })
    } catch (err) {
        next(err)
    }
}

export const revAnalytics=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data=await superAdminServices.revDetails(req.query);
        return res.status(200).json({
            success: true,
            message: 'All Analytics fetched successfully.',
            data,
        })
    } catch (err) {
        next(err)
    }
}