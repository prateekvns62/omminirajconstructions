import TableData from "@/app/components/booking/tableData";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function BookingTable() {
  try {
    const booking = await prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        paymentDetails: true,
      },
    });

    return <TableData booking={booking} />;
    
  } catch (error) {
    console.log(error);
    return <p>No record found.</p>;
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects after query execution
  }
}
