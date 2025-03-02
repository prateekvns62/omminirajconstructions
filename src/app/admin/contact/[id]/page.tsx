import { PrismaClient } from "@prisma/client";
import FormData from "@/app/components/contact/formData";

const prisma = new PrismaClient();

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  // Ensure that params are awaited before using them
  const {id} = await params;

  const userId = parseInt(id, 10);
  
  if (isNaN(userId)) return <p className="text-red-500 text-center">Invalid Form ID</p>;

  const user = await prisma.ContactUs.findUnique({
    where: { id: userId },
  });

  if (!user) return <p className="text-red-500 text-center">Contact Us Detail not found</p>;

  if (user.status === 1) {
    await prisma.ContactUs.update({
      where: { id: userId },
      data: { status: 0 },
    });
  }

  const adminReply = await prisma.contactUsReply.findMany({
    where: { contact_us_id: userId },
  });

  return <FormData user={user} adminReply={adminReply} />;
}
