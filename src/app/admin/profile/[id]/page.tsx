import FormData from "@/app/components/profile/formData";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function FranchiseDetailPage({ params }: { params: Promise <{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) return <p className="text-red-500 text-center">Invalid Profile ID</p>;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) return <p className="text-red-500 text-center">Admin Profile Detail not found for this id.</p>;

    return <FormData user={user} />;

  } catch (error) {
    console.error("Error fetching Admin Profile details:", error);
    return <p className="text-red-500 text-center">Something went wrong. Please try again later.</p>;
  } finally {
    await prisma.$disconnect();
  }
}
