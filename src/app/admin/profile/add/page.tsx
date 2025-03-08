import AdminUserForm from "@/app/components/profile/adminUserForm";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Franchiseform() {
  return <AdminUserForm/>;
}


