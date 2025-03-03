import { PrismaClient } from "@prisma/client";
import TableData from "@/app/components/contact/tableData";

const prisma = new PrismaClient();

export default async function Home() {
  try {
    <h2>Add Frenchise Record</h2>
  } catch (error) {
    return <p>No record found.</p>;
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects after query execution
  }
}
