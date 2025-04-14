import { PrismaClient } from "@prisma/client";
import TableData from "@/app/components/careers/tableData";

const prisma = new PrismaClient();

export default async function BranchAll() {
  try {
    const careers = await prisma.jobOpenings.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return <TableData careers={careers} />;
  } catch (error) {
    console.log(error);
    return <p>No record found.</p>;
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects after query execution
  }
}
