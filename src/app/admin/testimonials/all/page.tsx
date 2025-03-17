import { PrismaClient } from "@prisma/client";
import TableData from "@/app/components/testimonials/tableData";

const prisma = new PrismaClient();

export default async function TestimonialAll() {
  try {
    const testimonials = await prisma.customerTestimonials.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return <TableData testimonials={testimonials} />;
  } catch (error) {
    console.log(error);
    return <p>No record found.</p>;
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects after query execution
  }
}