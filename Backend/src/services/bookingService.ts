import prisma from "../config/prisma.js"
import { AppError } from "../utils/AppError.js"

// POST /api/v1/bookings → guest creates a booking (PRD §5.4, Pass 1)
export async function addBooking(
  inputs: {
    hotelId: string;
    roomTypeId: string;
    ratePlanId: string;
    checkinDate: string;
    checkoutDate: string;
    numRooms?: number;
    numAdults?: number;
    numChildren?: number;
    guestName: string;
    guestEmail: string;
    guestPhone?: string;
    specialRequests?: string;
  },
  user: { id: string; role: string } | undefined,
) {
  if (!user) throw new AppError('User not authenticated', 401);

  const {
    hotelId, roomTypeId, ratePlanId, checkinDate, checkoutDate,
    numRooms, numAdults, numChildren, guestName, guestEmail, guestPhone, specialRequests,
  } = inputs;

  const rooms = Number(numRooms) || 1;
  const adults = Number(numAdults) || 1;
  const children = Number(numChildren) || 0;

  // dates: min 1 night (PRD §5.4.2)
  const checkin = new Date(checkinDate);
  const checkout = new Date(checkoutDate);
  const numNights = Math.round((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24));
  if (numNights < 1) throw new AppError('Minimum stay is 1 night', 400);

  // room type must exist + be active, belong to the hotel, and fit the guests
  const roomType = await prisma.roomType.findFirst({ where: { id: roomTypeId, status: 'active' } });
  if (!roomType) throw new AppError('Room type not found', 404);
  if (roomType.hotelId !== hotelId) throw new AppError('Room does not belong to this hotel', 400);
  if (roomType.maxOccupancy < adults + children) throw new AppError('Guests exceed room occupancy', 400);

  // Pass 1 pricing: basePrice × nights × rooms (Pass 2: room_rates + GST + coupon)
  const roomTotal = Number(roomType.basePrice) * numNights * rooms;
  const totalAmount = roomTotal;

  // simple unique reference (Pass 2: nicer scheme / collision-safe)
  const bookingRef = 'BK' + Date.now().toString(36).toUpperCase();

  // create the booking — status/paymentStatus/source default to pending/pending/platform_direct
  const booking = await prisma.booking.create({
    data: {
      bookingRef,
      userId: user.id,
      hotelId,
      roomTypeId,
      ratePlanId,
      checkinDate: checkin,
      checkoutDate: checkout,
      numRooms: rooms,
      numAdults: adults,
      numChildren: children,
      numNights,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
      roomTotal,
      totalAmount,
    },
  });
  return booking;
  // Pass 2 (PRD §5.4): availability check + inventory hold + room_rates pricing + GST + coupon,
  // all wrapped in prisma.$transaction to prevent double-booking.
}

export async function detailsBooking(id:string,user:{id:string,role:string} | undefined){
    if (!user) throw new AppError('User not authenticated', 401);
    const booking=await prisma.booking.findFirst(
        {where:{id:id,userId:user.id}}
    )
    if(!booking)throw new AppError("No bookings found",404)
    return booking
}

// GET /api/v1/bookings/my → all bookings of the logged-in user (PRD §5.5.2)
export async function bookingsUser(user:{id:string,role:string} | undefined){
    if (!user) throw new AppError('User not authenticated', 401);
    const allBookings=await prisma.booking.findMany({
        where:{userId:user.id},
        orderBy:{createdAt:'desc'},
    })
    return allBookings
}

// POST /api/v1/bookings/:id/cancel → guest cancels their own booking (PRD §5.7, Pass 1)
export async function bookingCancel(id:string,input:{reason?:string},user:{id:string,role:string} | undefined){
    if (!user) throw new AppError('User not authenticated', 401);
    const {reason}=input

    // find the user's OWN booking
    const booking=await prisma.booking.findFirst({where:{id:id,userId:user.id}})
    if(!booking)throw new AppError('Booking not found',404)

    // only an upcoming booking can be cancelled
    if(booking.status!=='pending' && booking.status!=='confirmed'){
        throw new AppError(`Cannot cancel a booking that is ${booking.status}`,400)
    }

    const cancelled=await prisma.booking.update({
        where:{id},
        data:{
            status:'cancelled',
            cancelledAt:new Date(),
            cancellationReason:reason,
        },
    })
    return cancelled
    // Pass 2 (PRD §5.7): refund calc from hotel_policies.freeCancellationHours,
    // release held inventory (bookedRooms -= numRooms), all in prisma.$transaction.
}

// POST /api/v1/bookings/check-availability → read-only pre-check (PRD §5.4.1)
export async function checkAvailability(input:{roomTypeId:string,checkinDate:string,checkoutDate:string,numRooms?:number}){
    const { roomTypeId, checkinDate, checkoutDate, numRooms } = input;
    const rooms = Number(numRooms) || 1;

    // nights = checkin → checkout-1 ; min 1 night
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    const numNights = Math.round((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24));
    if (numNights < 1) throw new AppError('Minimum stay is 1 night', 400);

    // room type must exist + be active
    const roomType = await prisma.roomType.findFirst({ where: { id: roomTypeId, status: 'active' } });
    if (!roomType) throw new AppError('Room type not found', 404);

    // one batched query: all inventory rows for the nights [checkin, checkout)
    const inventory = await prisma.roomInventory.findMany({
        where: { roomTypeId, date: { gte: checkin, lt: checkout } },
    });

    // fewest free rooms across the stay; a night with NO row = 0 (not sellable)
    let minAvailable = 0;
    if (inventory.length === numNights) {
        minAvailable = Math.min(
            ...inventory.map((r) => r.totalRooms - r.bookedRooms - r.blockedRooms),
        );
    }
    const available = minAvailable >= rooms;

    // Pass 1 pricing (Pass 2: real room_rates + GST)
    const pricePerNight = Number(roomType.basePrice);
    const totalPrice = pricePerNight * numNights * rooms;

    return {
        available,
        roomTypeId,
        nights: numNights,
        roomsRequested: rooms,
        minAvailable,
        pricePerNight,
        totalPrice,
    };
}

