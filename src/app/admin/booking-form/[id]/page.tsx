import { PrismaClient } from "@prisma/client";
import FormData from "@/app/components/booking/formData";

const prisma = new PrismaClient();

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  try {
    const { id } = await params;

    const bookingId = parseInt(id, 10);
    
    
    if (isNaN(bookingId)) return <p className="text-red-500 text-center">Invalid Booking ID</p>;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        paymentDetails: true,
      },
    });

    if (!booking) return <p className="text-red-500 text-center">Contact Us Detail not found</p>;

    return <FormData booking={booking} />;

  } catch (error) {
    console.error("Error fetching user details:", error);
    return <p className="text-red-500 text-center">Something went wrong. Please try again later.</p>;
  }
}
