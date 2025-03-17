import { PrismaClient } from "@prisma/client";
import FormData from "@/app/components/testimonials/formData";

const prisma = new PrismaClient();

export default async function TestimonialDetailPage({ params }: { params: Promise <{ id: string }> }) {
  try {
    const { id } = await params;  // No need to await params

    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) return <p className="text-red-500 text-center">Invalid Service ID</p>;

    const testimonial = await prisma.customerTestimonials.findUnique({
      where: { id: userId },
    });

    if (!testimonial) return <p className="text-red-500 text-center">Service Detail not found</p>;

    return <FormData testimonial ={testimonial} />;

  } catch (error) {
    console.error("Error while fetching certificates details:", error);
    return <p className="text-red-500 text-center">Something went wrong. Please try again later.</p>;
  }
}