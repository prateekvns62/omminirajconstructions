import { PrismaClient } from "@prisma/client";
import FormData from "@/app/components/services/formData";

const prisma = new PrismaClient();

export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
  try {
    const { id } = params;  // No need to await params

    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) return <p className="text-red-500 text-center">Invalid Service ID</p>;

    const service = await prisma.ourServices.findUnique({
      where: { id: userId },
    });

    if (!service) return <p className="text-red-500 text-center">Service Detail not found</p>;

    return <FormData service ={service} />;

  } catch (error) {
    console.error("Error while fetching certificates details:", error);
    return <p className="text-red-500 text-center">Something went wrong. Please try again later.</p>;
  }
}
