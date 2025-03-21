import { PrismaClient } from "@prisma/client";
import TableData from "@/app/components/careers/jobTableData";

const prisma = new PrismaClient();

export default async function BranchAll() {
  try {
    const jobs = await prisma.jobApplication.findMany({
      include: { job: true },
    });

    return <TableData jobs={jobs} />;
  } catch (error) {
    console.log(error);
    return <p>No record found.</p>;
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects after query execution
  }
}
