import { PrismaClient } from "@prisma/client";
import UpdateServicesForm from "@/app/components/services/updateServicesForm";

const prisma = new PrismaClient();

export default async function CertificateDetailPage({ params }: { params: { id: string } }) {
  try {
    const { id } = params;  // No need to await params

    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) return <p className="text-red-500 text-center">Invalid Certificate ID</p>;

    const service = await prisma.ourServices.findUnique({
      where: { id: userId },
    });

    if (!service) return <p className="text-red-500 text-center">Certificate Detail not found</p>;

    return <UpdateServicesForm service ={service} />;

  } catch (error) {
    console.error("Error while fetching certificates details:", error);
    return <p className="text-red-500 text-center">Something went wrong. Please try again later.</p>;
  }
}
