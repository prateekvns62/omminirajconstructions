import { PrismaClient } from "@prisma/client";
import TableData from "@/app/components/contact/tableData";
import FranchiseForm from "@/app/components/franchise/franchiseForm";

const prisma = new PrismaClient();

export default async function Home() {
  return <FranchiseForm/>;
}


