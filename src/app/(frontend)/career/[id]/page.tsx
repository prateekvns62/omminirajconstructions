import JobDetails from "@/app/components/careers/jobDetails";
import { PrismaClient } from "@prisma/client";
import { Metadata } from "next";

const prisma = new PrismaClient();

export const metadata: Metadata = {
  title: "Career - Om Miniraj Building & Construction Services Private Limited",
  description:
    "Welcome to Om Miniraj Building and Construction Services Private Limited, your trusted partner in the world of construction and infrastructure development in India.",
};

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
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

    return (
      <>
        <JobDetails job={job} />
      </>
    );
  } catch (error) {
    console.error("Error fetching Jobs details:", error);
    return <p className="text-red-500 text-center">Something went wrong. Please try again later.</p>;
  }
}
