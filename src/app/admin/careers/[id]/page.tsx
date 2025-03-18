import { PrismaClient } from "@prisma/client";
import CareerDetails from "@/app/components/careers/formData";

const prisma = new PrismaClient();

export default async function JobDetailPage({ params }: { params: Promise <{ id: string }> }) {
  try {
    const { id } = await params;  // No need to await params

    const jobId = parseInt(id, 10);
    
    if (isNaN(jobId)) return <p className="text-red-500 text-center">Invalid Career ID</p>;

    const career = await prisma.jobOpenings.findUnique({
      where: { id: jobId },
    });

    if (!career) return <p className="text-red-500 text-center">Career Detail not found</p>;

    return <CareerDetails career ={career} />;

  } catch (error) {
    console.error("Error while fetching certificates details:", error);
    return <p className="text-red-500 text-center">Something went wrong. Please try again later.</p>;
  }
}
