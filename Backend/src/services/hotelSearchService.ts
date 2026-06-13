import { includes, treeifyError } from 'zod';
import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

/**
 * Hotel & city search service — business logic (queries Prisma).
 * Signatures are aligned with the controller; bodies are TODO.
 * Reminder (PRD/docs): only return `active` hotels and `approved` reviews,
 * and paginate listings (20/page).
 */

// GET /hotels/search → active hotels by city/dates/guests + filters/sorting (paginated)
export async function searchHotels(query: Record<string, unknown>) {
  // Filters supported now (Hotel columns/relations): starRating, propertyType,
  // minRating (review score), amenities (comma-separated amenity ids), sort.
  // TODO (Tier 2): date availability, guests, price range filter + price sort, distance.
  const { city, page, limit, starRating, propertyType, minRating, amenities, sort } = query;
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  // No city searched → no results.
  if (!city) return [];

  const cityRecord = await prisma.city.findFirst({
    where: { slug: String(city), isActive: true },
  });
  if (!cityRecord) throw new AppError('City not found', 404);

  // Build the filter incrementally — only add a condition when its param is present.
  const where: any = { cityId: cityRecord.id, status: 'active' };

  if (starRating) where.starRating = { gte: Number(starRating) }; // min star rating
  if (propertyType) where.propertyType = String(propertyType); // hotel/resort/boutique/...
  if (minRating) where.avgRating = { gte: Number(minRating) }; // min guest review score
  if (amenities) {
    const amenityIds = String(amenities)
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);
    // Require the hotel to have ALL selected amenities (one `some` per amenity).
    if (amenityIds.length) {
      where.AND = amenityIds.map((id) => ({ amenities: { some: { amenityId: id } } }));
    }
  }

  // Sorting — default: featured first, then highest rated.
  let orderBy: any = [{ isFeatured: 'desc' }, { avgRating: 'desc' }];
  if (sort === 'rating') orderBy = { avgRating: 'desc' };
  else if (sort === 'popularity') orderBy = { totalReviews: 'desc' };
  // 'price' sorting needs the rates layer (Tier 2) — not available yet.

  const hotels = await prisma.hotel.findMany({
    where,
    orderBy,
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
  });

  return hotels;
}

// GET /hotels/:slug → full detail of one active hotel
export async function hotelBySlug(slug: string) {
  const hotel = await prisma.hotel.findFirst({
    where: { slug: slug, status: 'active' },
    include: {
      city: true,
      policy: true,
      images: { orderBy: { displayOrder: 'asc' } },
      amenities: { include: { amenity: true } },
      roomTypes: { where: { status: 'active' }, orderBy: { displayOrder: 'asc' } },
    },
  });
  if (!hotel) throw new AppError('Hotel not found', 404);
  return hotel;
}

// GET /hotels/:id/rooms → room types + availability for the given dates
export async function roomTypes(id: string) {
  // TODO: room_types for hotel + availability from room_inventory / room_rates
  const rooms=await prisma.roomType.findMany({where:{hotelId:id,status:'active'},orderBy:{displayOrder:'asc'}})
  return rooms
}

// GET /hotels/:id/reviews → approved reviews, paginated, with aggregate score
export async function reviews(id: string,page?:string,limit?:string) {
    const pageNum=Number(page) || 1;
    const limitNum=Number(limit) || 20;

  // Run the page query and the aggregate together — they're independent.
  const [reviews,summary]=await Promise.all(
    [prisma.review.findMany({
      where:{hotelId:id,status:"approved"},
      orderBy:{createdAt:'desc'},
      skip:(pageNum-1)*limitNum,
      take:limitNum
    }),
    prisma.review.aggregate({
      where:{hotelId:id,status:"approved"},
      _avg:{overallRating:true},
      _count:true,}),
])
  return {
  averageRating: summary._avg.overallRating ?? 0,   // null when 0 reviews → fall back to 0
  totalReviews: summary._count,
  reviews,                                          // the current page
};
}

// GET /cities → active cities for discovery (no input)
export async function citiesActive() {
  // TODO: list active cities ordered by display_order
  const cities=await prisma.city.findMany({
    where:{isActive:true},
    orderBy:{displayOrder:'asc'}
  })
  return cities
}

// GET /cities/:slug/hotels → active hotels within a city
export async function hotelCity(slug: string,page:string,limit:string) {
  // TODO: active hotels for the city slug, paginated
    const pageNum=Number(page) || 1;
    const limitNum=Number(limit) || 20;
    const city=await prisma.city.findFirst({
        where:{slug:slug,isActive:true}
    }) 
    if(!city)throw new AppError('city not found',404)
    const hotels=await prisma.hotel.findMany({
        where:{cityId:city.id,status:"active"},
        skip:(pageNum-1)*limitNum,
        take:limitNum
    })
    return hotels
}

