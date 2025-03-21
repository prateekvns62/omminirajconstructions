import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function JobPaymentPage({ params }: { params: Promise<{ identifire: string }> }) {
  try {

    const { identifire } = await params;

    if (!identifire) {
      return <p className="text-red-500 text-center">Invalid Page</p>;
    }

    const page = await prisma.pageContent.findUnique({
        where: { identifier: identifire},
      });

    if (!page) {
      return <p className="text-red-500 text-center">Page not found</p>;
    }

    return (
      <div className="max-w-3xl mx-auto p-6">
        <div
          className="prose max-w-full"
          dangerouslySetInnerHTML={{ __html: page.html }}
        />
        {page.css && (
          <style dangerouslySetInnerHTML={{ __html: page.css }} />
        )}
      </div>
    );

    //return <JobDetails page = {page} />;
  } catch (error) {
    console.error("Error fetching Jobs details:", error);
    return <p className="text-red-500 text-center">Something went wrong. Please try again later.</p>;
  }
}
