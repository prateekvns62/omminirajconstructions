import { PrismaClient } from "@prisma/client";
import TableData from "@/app/components/contact/tableData";

const prisma = new PrismaClient();

export default async function Home() {
  try {
    const users = await prisma.contactUs.findMany({
      orderBy: {
        created_at: "desc", // Fetch newest entries first
      },
    });

    return <TableData users={users} />;
  } catch (error) {
    return <p>No record found.</p>;
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects after query execution
  }
}
