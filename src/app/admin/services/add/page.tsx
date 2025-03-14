import { PrismaClient } from "@prisma/client";
import ServicesForm from "@/app/components/services/serviceForm";

const prisma = new PrismaClient();

export default async function Franchiseform() {
  return <ServicesForm/>;
}


