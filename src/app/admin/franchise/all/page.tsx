import TableData from "@/app/components/franchise/tableData";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Home() {
  try {
    const franchises = await prisma.franchiseRecord.findMany({
      orderBy: {
        createdAt: "desc", // Fetch newest entries first
      },
    });
    return <TableData records={franchises} />;
  } catch (error) {
    return <p>No record found.</p>;
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects after query execution
  }
}
