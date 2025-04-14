import { PrismaClient } from "@prisma/client";
import TableData from "@/app/components/branches/tableData";

const prisma = new PrismaClient();

export default async function BranchAll() {
  try {
    const branches = await prisma.branches.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return <TableData branches={branches} />;
  } catch (error) {
    console.log(error);
    return <p>No record found.</p>;
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects after query execution
  }
}
