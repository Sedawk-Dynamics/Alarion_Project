import { email, number } from 'zod';
import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import type { PropertyType, HotelStatus } from '@prisma/client';

// POST /admin/hotels → create one hotel row (PRD §6.2.1, Pass 1: core hotel only)
export async function hotelOnboard(
  inputs: {
    name: string;
    slug: string;
    addressLine1: string;
    addressLine2?: string;
    cityId: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
    starRating: number;
    legalName?: string;
    gstNumber?: string;
    description?: string;
    shortDescription?: string;
    propertyType?: PropertyType;
    contactPhone?: string;
    contactEmail?: string;
    websiteUrl?: string;
    mainImageUrl?: string;
    commissionPct?: number;
  },
  user: { id: string; role: string } | undefined,
) {
  if (!user) throw new AppError('Authentication required', 401);

  // slug must be unique — reject early with a clean 409 instead of a Prisma P2002.
  const existing = await prisma.hotel.findUnique({ where: { slug: inputs.slug } });
  if (existing) throw new AppError('Hotel slug already exists', 409);

  // Build the row explicitly so stray fields (images, amenities, rooms…) are ignored.
  const newHotel = await prisma.hotel.create({
    data: {
      name: inputs.name,
      slug: inputs.slug,
      addressLine1: inputs.addressLine1,
      addressLine2: inputs.addressLine2,
      cityId: inputs.cityId,
      state: inputs.state,
      pincode: inputs.pincode,
      latitude: inputs.latitude,
      longitude: inputs.longitude,
      starRating: inputs.starRating,
      legalName: inputs.legalName,
      gstNumber: inputs.gstNumber,
      description: inputs.description,
      shortDescription: inputs.shortDescription,
      propertyType: inputs.propertyType,
      contactPhone: inputs.contactPhone,
      contactEmail: inputs.contactEmail,
      websiteUrl: inputs.websiteUrl,
      mainImageUrl: inputs.mainImageUrl,
      commissionPct: inputs.commissionPct,
      createdById: user.id, // who onboarded it — from the token, not the body
    },
  });
  return newHotel;
}

// PUT /admin/hotels/:id → partial update of one hotel (PRD §6.2.2)
export async function detailsUpdate(
  id: string,
  inputs: {
    name?: string;
    slug?: string;
    addressLine1?: string;
    addressLine2?: string;
    cityId?: string;
    state?: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
    starRating?: number;
    legalName?: string;
    gstNumber?: string;
    description?: string;
    shortDescription?: string;
    propertyType?: PropertyType;
    contactPhone?: string;
    contactEmail?: string;
    websiteUrl?: string;
    mainImageUrl?: string;
    commissionPct?: number;
    status?: HotelStatus; // activate / deactivate (§6.2.2)
  },
  user: { id: string; role: string } | undefined,
) {
  if (!user) throw new AppError('Authentication required', 401);

  // detail lookup → 404 if the hotel doesn't exist
  const isHotel = await prisma.hotel.findUnique({ where: { id: id } });
  if (!isHotel) throw new AppError('Hotel not found', 404);

  // if the slug is being changed, make sure no OTHER hotel already uses it
  if (inputs.slug && inputs.slug !== isHotel.slug) {
    const clash = await prisma.hotel.findFirst({
      where: { slug: inputs.slug, NOT: { id } },
    });
    if (clash) throw new AppError('Hotel slug already exists', 409);
  }

  // partial update — Prisma skips any field left undefined
  const updatedHotel = await prisma.hotel.update({ where: { id: id }, data: inputs });
  return updatedHotel;
}

// GET /admin/analytics/dashboard → platform-wide headline metrics (PRD §6.1, Pass 1)
export async function dashboardSummary(_query: { period?: string }) {
  // Period boundaries for the booking buckets.
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - 6); // last 7 days, including today
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // All independent reads — run them together.
  const [bookingsToday, bookingsWeek, bookingsMonth, revenue, activeHotels, registeredUsers] =
    await Promise.all([
      prisma.booking.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.booking.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.booking.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.booking.aggregate({ _sum: { totalAmount: true } }),
      prisma.hotel.count({ where: { status: 'active' } }),
      prisma.user.count({ where: { role: 'guest' } }),
    ]);

  return {
    bookings: { today: bookingsToday, week: bookingsWeek, month: bookingsMonth },
    revenue: { gross: revenue._sum.totalAmount ?? 0 }, // net (− commission) is Pass 2
    activeHotels,
    registeredUsers,
  };
}

// GET /admin/bookings → all bookings across all hotels, filtered + paginated (PRD §6.3)
export async function bookings(query:{hotelId?:string,status?:string,paymentStatus?:string,from?:string,to?:string,page?:string,limit?:string}){
    const {hotelId,status,paymentStatus,from,to,page,limit}=query;
    const pageNum=Number(page) || 1;
    const limitNum=Number(limit) || 20;

    // build the filter incrementally — add a condition only when its param is present
    const where:any={}
    if(hotelId)where.hotelId=hotelId
    if(status)where.status=status
    if(paymentStatus)where.paymentStatus=paymentStatus
    if(from || to){
        where.createdAt={};
        if(from)where.createdAt.gte=new Date(from)
        if(to)where.createdAt.lte=new Date(to)
    }

    const bookings=await prisma.booking.findMany({
        where,
        orderBy:{createdAt:'desc'},
        skip:(pageNum-1)*limitNum,
        take:limitNum
    })

    return bookings;
    
}

// GET /admin/users → all registered users, searchable + filtered + paginated (PRD §6.4)
export async function users(query:{search?:string,role?:string,status?:string,page?:string,limit?:string}){
    const {search,role,status,page,limit}=query;
    const pageNum=Number(page) || 1;
    const limitNum=Number(limit) || 20;

    // build the filter incrementally — add a condition only when its param is present
    const where:any={};
    if(role) where.role=role;
    if(status) where.status=status;
    if(search){
        // one search box → look across name / email / phone (OR = match ANY)
        where.OR=[
            {name:{contains:search,mode:'insensitive'}},
            {email:{contains:search,mode:'insensitive'}},
            {phone:{contains:search}},
        ];
    }

    const users=await prisma.user.findMany({
        where,
        // whitelist safe fields — NEVER return passwordHash
        select:{id:true,name:true,email:true,phone:true,role:true,status:true,createdAt:true},
        orderBy:{createdAt:'desc'},
        skip:(pageNum-1)*limitNum,
        take:limitNum,
    })
    return users;
}

// GET /admin/revenue → platform revenue analytics (PRD §6.5, Pass 1)
export async function revDetails(query:{from?:string,to?:string,groupBy?:string}){
    const {from,to,groupBy}=query;

    // optional date-range filter on when the booking was made
    const where:any={};
    if(from || to){
        where.createdAt={};
        if(from)where.createdAt.gte=new Date(from);
        if(to)where.createdAt.lte=new Date(to);
    }

    // headline totals across all hotels
    const totals=await prisma.booking.aggregate({
        where,
        _sum:{totalAmount:true},
        _count:true,
    });
    const grossRevenue=Number(totals._sum.totalAmount ?? 0);
    const totalBookings=totals._count;
    // ABV = average booking value (avoid divide-by-zero)
    const averageBookingValue=totalBookings ? grossRevenue/totalBookings : 0;

    // revenue split by hotel (default) or by room type
    const by = groupBy==='roomType' ? 'roomTypeId' as const : 'hotelId' as const;
    const breakdown=await prisma.booking.groupBy({
        by:[by],
        where,
        _sum:{totalAmount:true},
        _count:true,
    });

    return {
        grossRevenue,
        totalBookings,
        averageBookingValue,
        groupBy:by,
        breakdown,
    };
}