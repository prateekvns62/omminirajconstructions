import { PrismaClient } from "@prisma/client";
import UpdateClientsForm from "@/app/components/clients/updateClientsForm";

const prisma = new PrismaClient();

export default async function ClientDetailPage({ params }: { params: Promise <{ id: string }> }) {
  try {
    const { id } = await params;  // No need to await params

    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) return <p className="text-red-500 text-center">Invalid Client ID</p>;

    const client = await prisma.ourClients.findUnique({
      where: { id: userId },
    });

    if (!client) return <p className="text-red-500 text-center">Client Detail not found</p>;

    return <UpdateClientsForm client ={client} />;

  } catch (error) {
    console.error("Error while fetching certificates details:", error);
    return <p className="text-red-500 text-center">Something went wrong. Please try again later.</p>;
  }
}
