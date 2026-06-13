import { AppError } from '../utils/AppError.js';
import prisma from '../config/prisma.js';
import { createOrder, refundPayment, verifyPaymentSignature } from '../utils/razorpay.js';

export async function razorpayOrder(input:{bookingId:string},user:{id:string,role:string} | undefined){
    if (!user) throw new AppError('Authentication required', 401);
    const booking=await prisma.booking.findFirst({where:{id:input.bookingId,userId:user.id}})
    if(!booking)throw new AppError('Booking not found',404)
    if(booking.paymentStatus==='captured')throw new AppError('Booking already paid',400);
    
    const amount=Math.round(Number(booking.totalAmount)*100)
    const order=await createOrder(amount,booking.bookingRef)
    const payment=await prisma.payment.create({
        data:{
            bookingId:booking.id,
            razorpayOrderId:order.id,
            amount:booking.totalAmount,
            currency:"INR",
            status:"pending"
        }
    })
    return {
        orderId:order.id,
        amount:amount,
        currency:'INR',
        keyId:process.env.RAZORPAY_KEY_ID,
        bookingRef:booking.bookingRef,
        payment:payment.id
    }
}

// POST /api/v1/payments/verify → confirm a payment from the browser (PRD §5.4 step 5)
export async function paymentVerify(
  inputs:{razorpayOrderId:string,razorpayPaymentId:string,razorpaySignature:string},
  user:{id:string,role:string} | undefined,
){
    if (!user) throw new AppError('Authentication required', 401);

    // 1) is the signature genuinely from Razorpay? (pure HMAC check, no DB)
    const ok = verifyPaymentSignature(inputs.razorpayOrderId, inputs.razorpayPaymentId, inputs.razorpaySignature);
    if(!ok) throw new AppError('Payment signature verification failed', 400);

    // 2) find the payment row we saved at create-order
    const payment = await prisma.payment.findFirst({ where: { razorpayOrderId: inputs.razorpayOrderId } });
    if(!payment) throw new AppError('Payment not found', 404);

    // 3) idempotency — /verify and the webhook may both fire; only process once
    if(payment.status === 'captured') return payment;

    // 4) capture the payment AND confirm the booking together (atomic)
    const [updatedPayment, updatedBooking] = await prisma.$transaction([
        prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: 'captured',
                razorpayPaymentId: inputs.razorpayPaymentId,
                razorpaySignature: inputs.razorpaySignature,
            },
        }),
        prisma.booking.update({
            where: { id: payment.bookingId },
            data: { paymentStatus: 'captured', status: 'confirmed', confirmedAt: new Date() },
        }),
    ]);

    return { payment: updatedPayment, booking: updatedBooking };
}

// POST /api/v1/payments/:id/refund → refund a captured payment (PRD §5.7)
export async function refundInitiate(
  id: string,                                   // :id = our payments row id
  body: { amount?: number; reason?: string },
  user: { id: string; role: string } | undefined,
){
    if (!user) throw new AppError('Authentication required', 401);

    // find the payment row by OUR id
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new AppError('Payment not found', 404);
    if (payment.status !== 'captured') throw new AppError('Only a captured payment can be refunded', 400);
    if (!payment.razorpayPaymentId) throw new AppError('Missing Razorpay payment id', 400);

    // amount: full (payment.amount) or partial (body.amount, must be <= the captured amount)
    const fullAmount = Number(payment.amount);
    const refundAmount = body.amount != null ? Number(body.amount) : fullAmount;
    if (refundAmount <= 0 || refundAmount > fullAmount) {
        throw new AppError('Invalid refund amount', 400);
    }
    const amountInPaise = Math.round(refundAmount * 100);

    // call Razorpay using the razorpayPaymentId (pay_xxx) — NOT our :id
    const refund = await refundPayment(payment.razorpayPaymentId, amountInPaise);

    const isPartial = refundAmount < fullAmount;

    // record the refund + flip payment + booking, atomically
    const [refundRow] = await prisma.$transaction([
        prisma.refund.create({
            data: {
                paymentId: payment.id,
                bookingId: payment.bookingId,
                razorpayRefundId: refund.id,
                amount: refundAmount,
                reason: body.reason,
                status: 'initiated',
            },
        }),
        prisma.payment.update({
            where: { id: payment.id },
            data: { status: isPartial ? 'partially_refunded' : 'refunded' },
        }),
        prisma.booking.update({
            where: { id: payment.bookingId },
            data: { paymentStatus: isPartial ? 'partially_refunded' : 'refunded', refundAmount },
        }),
    ]);

    return refundRow;
}

export async function webhookHandle(_body: any, _signature: string){

}
