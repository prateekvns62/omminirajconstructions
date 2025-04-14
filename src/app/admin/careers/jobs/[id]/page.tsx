import { PrismaClient } from "@prisma/client";
import JobDetails from "@/app/components/careers/jobFormData";

const prisma = new PrismaClient();

export default async function JobDetailPage({ params }: { params: Promise <{ id: string }> }) {
  try {
    const { id } = await params;  // No need to await params

    const jobId = parseInt(id, 10);
    
    if (isNaN(jobId)) return <p className="text-red-500 text-center">Invalid Job ID</p>;

    const job = await prisma.jobApplication.findUnique({
      where: { id: jobId },
      include: { job: true },
    });

    if (!job) return <p className="text-red-500 text-center">Job Detail not found</p>;


    return <JobDetails job ={job} />;

  } catch (error) {
    console.error("Error while fetching certificates details:", error);
    return <p className="text-red-500 text-center">Something went wrong. Please try again later.</p>;
  }
}
