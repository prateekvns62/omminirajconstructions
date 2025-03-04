import FormData from "@/app/components/franchise/formData";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const franchiseId = parseInt(id, 10);
    
    if (isNaN(franchiseId)) return <p className="text-red-500 text-center">Invalid Franchise ID</p>;

    const franchise = await prisma.franchiseRecord.findUnique({
      where: { id: franchiseId },
    });
    if (!franchise) return <p className="text-red-500 text-center">Franchise Detail not found</p>;

    return <FormData franchise={franchise} />;

  } catch (error) {
    console.error("Error fetching franchise details:", error);
    return <p className="text-red-500 text-center">Something went wrong. Please try again later.</p>;
  } finally {
    await prisma.$disconnect();
  }
}
