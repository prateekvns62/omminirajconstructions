import { PrismaClient } from "@prisma/client";
import CertificateForm from "@/app/components/certificates/certificateForm";

const prisma = new PrismaClient();

export default async function Franchiseform() {
  return <CertificateForm/>;
}


