import { Router } from 'express';
import * as hotelSearchController from '../controllers/hotelSeaRchController.js';

const route = Router();

// ---- Hotels (public) ----

// Search hotels by city, dates, guests + filters/sorting (paginated)
route.get('/hotels/search', hotelSearchController.searchHotels);

// Hotel detail by slug — keep AFTER /hotels/search so ":slug" doesn't capture "search"
route.get('/hotels/:slug', hotelSearchController.searchHotelBySlug);

// Room types + availability for a hotel (for the given dates)
route.get('/hotels/:id/rooms', hotelSearchController.roomTypes);

// Approved reviews for a hotel (aggregate score + pagination)
route.get('/hotels/:id/reviews', hotelSearchController.hotelReviews);

// ---- Cities (public) ----

// List active cities (homepage / destination cards)
route.get('/cities', hotelSearchController.activeCities);

// Hotels within a city (paginated)
route.get('/cities/:slug/hotels', hotelSearchController.cityHotel);

export default route;

