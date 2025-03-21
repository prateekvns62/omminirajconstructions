import { PrismaClient } from "@prisma/client";
import TableData from "@/app/components/pages/tableData";

const prisma = new PrismaClient();

export default async function Pages() {
  try {
    const pages = await prisma.pageContent.findMany({
      orderBy: {
        createdAt: "desc", // Fetch newest entries first
      },
    });

    return <TableData pages={pages} />;
  } catch (error) {
    console.log(error);
    return <p>No record found.</p>;
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects after query execution
  }
}
