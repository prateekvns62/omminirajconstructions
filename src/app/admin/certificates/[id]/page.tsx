import { PrismaClient } from "@prisma/client";
import FormData from "@/app/components/certificates/formData";

const prisma = new PrismaClient();

export default async function CertificateDetailPage({ params }: { params: { id: string } }) {
  try {
    const { id } = params;  // No need to await params

    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) return <p className="text-red-500 text-center">Invalid Certificate ID</p>;

    const certificate = await prisma.activeCertificate.findUnique({
      where: { id: userId },
    });

    if (!certificate) return <p className="text-red-500 text-center">Certificate Detail not found</p>;

    return <FormData certificate ={certificate} />;

  } catch (error) {
    console.error("Error while fetching certificates details:", error);
    return <p className="text-red-500 text-center">Something went wrong. Please try again later.</p>;
  }
}
