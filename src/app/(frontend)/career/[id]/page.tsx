import JobDetails from "@/app/components/careers/jobDetails";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function JobPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  try {

    const { id } = await params;

    if (!id) {
      return <p className="text-red-500 text-center">Invalid Job</p>;
    }

    const job = await prisma.jobOpenings.findUnique({
        where: { jobIdentifire: id},
        include: {
          applications: true,
        },
      });

    if (!job) {
      return <p className="text-red-500 text-center">Job Detail not found</p>;
    }

    return <JobDetails job = {job} />;
  } catch (error) {
    console.error("Error fetching Jobs details:", error);
    return <p className="text-red-500 text-center">Something went wrong. Please try again later.</p>;
  }
}
