import { PrismaClient } from "@prisma/client";
import UpdateBranchesForm from "@/app/components/branches/updateBranchesForm";

const prisma = new PrismaClient();

export default async function ServiceDetailFormPage({ params }: { params: Promise <{ id: string }> }) {
  try {
    const { id } = await params;  // No need to await params

    const branchId = parseInt(id, 10);
    
    if (isNaN(branchId)) return <p className="text-red-500 text-center">Invalid Branch ID</p>;

    const branch = await prisma.branches.findUnique({
      where: { id: branchId },
    });

    if (!branch) return <p className="text-red-500 text-center">Branch Detail not found</p>;

    return <UpdateBranchesForm branch ={branch} />;

  } catch (error) {
    console.error("Error while fetching branch details:", error);
    return <p className="text-red-500 text-center">Something went wrong. Please try again later.</p>;
  }
}
