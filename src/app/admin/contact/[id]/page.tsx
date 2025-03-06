import { PrismaClient } from "@prisma/client";
import FormData from "@/app/components/contact/formData";

const prisma = new PrismaClient();

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  try {
    const { id } = params;  // No need to await params

    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) return <p className="text-red-500 text-center">Invalid Form ID</p>;

    const user = await prisma.contactUs.findUnique({
      where: { id: userId },
    });

    if (!user) return <p className="text-red-500 text-center">Contact Us Detail not found</p>;

    if (user.status === 1) {
      await prisma.contactUs.update({
        where: { id: userId },
        data: { status: 0 },
      });
    }

    const adminReply = await prisma.contactUsReply.findMany({
      where: { contact_us_id: userId },
    });

    const contactUsReplyOnce = process.env.CONTACTUS_REPLY_ONCE === "1";

    return <FormData user={user} adminReply={adminReply} contactUsReplyOnce={contactUsReplyOnce} />;

  } catch (error) {
    console.error("Error fetching user details:", error);
    return <p className="text-red-500 text-center">Something went wrong. Please try again later.</p>;
  }
}
