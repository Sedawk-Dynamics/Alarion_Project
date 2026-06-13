import { AppError } from "../utils/AppError.js";
import prisma from "../config/prisma.js";
import type { RoomStatus } from "@prisma/client";

// GET /hotel/dashboard → at-a-glance metrics for the admin's OWN hotel (PRD §7.1, Pass 1)
export async function hotelDashboard(
  _query: { period?: string },
  user: { id: string; role: string } | undefined,
) {
  if (!user) throw new AppError('User not authorised', 401);

  // tenancy: which hotel does this admin manage? scope everything to it.
  const adminHotel = await prisma.hotelAdmin.findFirst({ where: { userId: user.id } });
  if (!adminHotel) throw new AppError('No hotel assigned to this admin', 403);
  const hotelId = adminHotel.hotelId;

  // date boundaries
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfToday.getDate() + 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - 6); // last 7 days incl. today
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [checkInsToday, checkOutsToday, inHouseGuests, revToday, revWeek, revMonth, recentBookings] =
    await Promise.all([
      // arrivals today (checkin date falls within today)
      prisma.booking.count({ where: { hotelId, checkinDate: { gte: startOfToday, lt: startOfTomorrow } } }),
      // departures today
      prisma.booking.count({ where: { hotelId, checkoutDate: { gte: startOfToday, lt: startOfTomorrow } } }),
      // in-house: currently checked in (arrived on/before today, leaving after today)
      prisma.booking.count({
        where: { hotelId, status: 'checked_in', checkinDate: { lte: startOfToday }, checkoutDate: { gt: startOfToday } },
      }),
      // revenue buckets (by when the booking was made)
      prisma.booking.aggregate({ where: { hotelId, createdAt: { gte: startOfToday } }, _sum: { totalAmount: true } }),
      prisma.booking.aggregate({ where: { hotelId, createdAt: { gte: startOfWeek } }, _sum: { totalAmount: true } }),
      prisma.booking.aggregate({ where: { hotelId, createdAt: { gte: startOfMonth } }, _sum: { totalAmount: true } }),
      // recent bookings for the feed
      prisma.booking.findMany({ where: { hotelId }, orderBy: { createdAt: 'desc' }, take: 10 }),
    ]);

  return {
    snapshot: { checkInsToday, checkOutsToday, inHouseGuests },
    revenue: {
      today: Number(revToday._sum.totalAmount ?? 0),
      week: Number(revWeek._sum.totalAmount ?? 0),
      month: Number(revMonth._sum.totalAmount ?? 0),
    },
    recentBookings,
    // Pass 2 (PRD §7.1): available rooms, occupancy rate, upcoming arrivals/departures (7d), notifications
  };
}

// PUT /hotel/rooms/:id → partial update of one room type the admin owns (PRD §7.2.1)
export async function roomTypeUpdate(
  id: string,
  inputs: {
    name?: string;
    description?: string;
    bedType?: string;
    maxAdults?: number;
    maxChildren?: number;
    maxOccupancy?: number;
    basePrice?: number;
    totalRooms?: number;
    amenities?: any;
    images?: any;
    roomSizeSqft?: number;
    floor?: string;
    viewType?: string;
    displayOrder?: number;
    status?: RoomStatus; // active / inactive / maintenance (online-offline toggle)
  },
  user: { id: string; role: string } | undefined,
) {
  if (!user) throw new AppError('User not authorised', 401);

  // tenancy: which hotel does this admin manage?
  const adminHotel = await prisma.hotelAdmin.findFirst({ where: { userId: user.id } });
  if (!adminHotel) throw new AppError('No hotel assigned to this admin', 403);

  // the room must exist AND belong to this admin's hotel
  const room = await prisma.roomType.findUnique({ where: { id } });
  if (!room) throw new AppError('Room type not found', 404);
  if (room.hotelId !== adminHotel.hotelId) {
    throw new AppError('You do not manage this hotel', 403);
  }

  // partial update — Prisma skips any field left undefined
  const updatedRoomType = await prisma.roomType.update({ where: { id }, data: inputs });
  return updatedRoomType;
}

export async function inventoryUpdate(inputs:{from?:string,to?:string},user:{id:string,role:string}){
    if (!user) throw new AppError('User not authorised', 401);
    
}

export async function ratesUpdate(){

}

// GET /hotel/bookings → this hotel's bookings, filtered + paginated (PRD §7.4)
export async function bookings(
  query:{status?:string,from?:string,to?:string,roomTypeId?:string,guestName?:string,source?:string,page?:string,limit?:string},
  user:{id:string,role:string} | undefined,
){
    if (!user) throw new AppError('User not authorised', 401);

    // tenancy: lock results to the admin's OWN hotel
    const adminHotel = await prisma.hotelAdmin.findFirst({ where: { userId: user.id } });
    if (!adminHotel) throw new AppError('No hotel assigned to this admin', 403);

    const {status,from,to,roomTypeId,guestName,source,page,limit}=query
    const pageNum=Number(page) || 1;
    const limitNum=Number(limit) || 20;

    // forced tenant filter first, then add optional filters only when present
    const where:any={ hotelId: adminHotel.hotelId }
    if(status)where.status=status
    if(roomTypeId)where.roomTypeId=roomTypeId
    if(guestName)where.guestName={ contains: guestName, mode: 'insensitive' }
    if(source)where.source=source
    if(from || to){
        where.createdAt={}
        if(from)where.createdAt.gte=new Date(from)
        if(to)where.createdAt.lte=new Date(to);
    }

    const bookings=await prisma.booking.findMany({
        where,
        orderBy:{createdAt:'desc'},
        skip:(pageNum-1)*limitNum,
        take:limitNum,
    })
    return bookings
}

export async function bookingsWalkin(){

}

export async function bookingStatusUpdate(){

}

export async function connectStayFlexi(){

}

export async function syncStayflexi(){

}

export async function specificReport(){

}


