import JobListing from "@/app/components/careers/jobListing";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function CareerListingPage() {
  try {

    const jobs = await prisma.jobOpenings.findMany({
      where: {status: 1},
      include: {
        applications: true,
      },
    });

    if (!jobs) {
      return <p className="text-red-500 text-center">Currently we are not having any job Openings</p>;
    }

    return <JobListing jobs={jobs} />;
  } catch (error) {
    console.error("Error fetching jobs details:", error);
    return <p className="text-red-500 text-center">Something went wrong. Please try again later.</p>;
  }
}
