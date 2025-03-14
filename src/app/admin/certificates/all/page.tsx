import { PrismaClient } from "@prisma/client";
import TableData from "@/app/components/certificates/tableData";

const prisma = new PrismaClient();

export default async function Contact() {
  try {
    const certificates = await prisma.activeCertificate.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return <TableData certificates={certificates} />;
  } catch (error) {
    return <p>No record found.</p>;
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects after query execution
  }
}
