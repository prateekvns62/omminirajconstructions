import { PrismaClient } from "@prisma/client";
import TableData from "@/app/components/clients/imageClientTableData";

const prisma = new PrismaClient();

export default async function Clients() {
  try {
    const clients = await prisma.ourClients.findMany({
      where: {type: 0},
      orderBy: {
        id: "asc",
      },
    });

    return <TableData clients={clients} />;
  } catch (error) {
    console.log(error);
    return <p>No record found.</p>;
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects after query execution
  }
}
