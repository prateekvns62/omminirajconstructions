import { NextApiRequest, NextApiResponse } from "next";
import crypto from 'crypto';
import prisma from "@/lib/prisma";

const generatedSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string
 ) => {
  const keySecret = process.env.key_secret;
  if (!keySecret) {
   throw new Error(
    'Razorpay key secret is not defined in environment variables.'
   );
  }
  const sig = crypto
   .createHmac('sha256', keySecret)
   .update(razorpayOrderId + '|' + razorpayPaymentId)
   .digest('hex');
  return sig;
 };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { orderCreationId, razorpayPaymentId, razorpaySignature, bookingId, amount } = (await req.body);
      
      const signature = generatedSignature(orderCreationId, razorpayPaymentId);

      const status = signature === razorpaySignature ? "SUCCESS" : "FAILED";

      const existingPayment = await prisma.paymentDetails.findUnique({
        where: { bookingId },
      });
      
      if (existingPayment) {
        await prisma.paymentDetails.update({
          where: { bookingId },
          data: {
            transactionId: razorpayPaymentId,
            amount,
            status,
            paymentMethod: "razorpay",
            updatedAt: new Date(),
          },
        });
      } else {
        // Create a new payment record
        await prisma.paymentDetails.create({
          data: {
            bookingId,
            transactionId: razorpayPaymentId,
            amount,
            status,
            paymentMethod: "razorpay",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }

      if (signature !== razorpaySignature) {
        await prisma.booking.update({
          where: { bookingId },
          data: {
            status:3,
            updatedAt: new Date(),
          },
        });

        return res.status(400).json(
         { message: 'payment verification failed', isOk: false }
        );
      }

      await prisma.booking.update({
        where: { bookingId },
        data: {
          status:0,
          updatedAt: new Date(),
        },
      });

      return res.status(200).json({ message: 'payment verified successfully', isOk: true });

    } catch (error) {
      res.status(500).json({ message: "Something went wrong!", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}