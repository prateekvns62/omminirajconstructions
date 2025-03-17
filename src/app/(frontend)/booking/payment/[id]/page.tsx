import PaymentDetailPage from "@/app/components/booking/paymentDetailPage";
import PaymentForm from "@/app/components/booking/paymentForm";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function BookingPaymentPage({ params }: { params: Promise<{ id: number }> }) {
  try {

    const { id } = await params;

    if (!id) {
      return <p className="text-red-500 text-center">Invalid Booking ID</p>;
    }

    const bookingId = Number(id); // ✅ No need for await

    if (isNaN(bookingId)) {
      return <p className="text-red-500 text-center">Invalid Booking ID</p>;
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        paymentDetails: true,
      },
    });

    if (!booking) {
      return <p className="text-red-500 text-center">Booking Detail not found</p>;
    }

    if (booking.paymentDetails?.status === "SUCCESS") {
      return <PaymentDetailPage booking={booking} />;
    }

    return <PaymentForm booking={booking} />;
  } catch (error) {
    console.error("Error fetching booking details:", error);
    return <p className="text-red-500 text-center">Something went wrong. Please try again later.</p>;
  }
}
