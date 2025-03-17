import { PrismaClient } from "@prisma/client";
import TableData from "@/app/components/services/tableData";

const prisma = new PrismaClient();

export default async function ServiceAll() {
  try {
    const services = await prisma.ourServices.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return <TableData services={services} />;
  } catch (error) {
    console.log(error);
    return <p>No record found.</p>;
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects after query execution
  }
}
