import type { Request, Response, NextFunction } from 'express';
import * as hotelSearchService from '../services/hotelSearchService.js';

/**
 * Hotel & city search controllers (public, read-only).
 * Thin layer: read req, call the service, return { success, message, data }.
 */

// GET /api/v1/hotels/search
// Search active hotels by city, dates, guests + filters/sorting (paginated).
// All search inputs arrive as query-string params.
export const searchHotels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await hotelSearchService.searchHotels(req.query);
    return res.status(200).json({
      success: true,
      message: 'Hotel search results.',
      data,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/hotels/:slug
// Full detail for a single active hotel, looked up by its URL slug.
export const searchHotelBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug as string;
    const data = await hotelSearchService.hotelBySlug(slug);
    return res.status(200).json({
      success: true,
      message: 'Hotel details.',
      data,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/hotels/:id/rooms
// Room types + availability for a hotel (dates come from the query string).
export const roomTypes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const data = await hotelSearchService.roomTypes(id);
    return res.status(200).json({
      success: true,
      message: 'Hotel room types and availability.',
      data,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/hotels/:id/reviews
// Approved guest reviews for a hotel (paginated, with aggregate score).
export const hotelReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const {page,limit}=req.query as {page:string,limit:string};
    const data = await hotelSearchService.reviews(id,page,limit);
    return res.status(200).json({
      success: true,
      message: 'Hotel reviews.',
      data,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/cities
// List active cities for discovery (homepage / destination cards).
export const activeCities = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await hotelSearchService.citiesActive();
    return res.status(200).json({
      success: true,
      message: 'Active cities.',
      data,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/cities/:slug/hotels
// List active hotels within a given city (by city slug, paginated).
export const cityHotel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug as string;
    const {page,limit}=req.query as {page:string,limit:string}
    const data = await hotelSearchService.hotelCity(slug,page,limit);
    return res.status(200).json({
      success: true,
      message: 'Hotels in city.',
      data,
    });
  } catch (err) {
    next(err);
  }
};
