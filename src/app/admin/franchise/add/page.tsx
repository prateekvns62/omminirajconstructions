import { PrismaClient } from "@prisma/client";
import FranchiseForm from "@/app/components/franchise/franchiseForm";

const prisma = new PrismaClient();

export default async function Franchiseform() {
  return <FranchiseForm/>;
}


