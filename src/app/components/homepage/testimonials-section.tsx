"use client";
import { useEffect, useState } from "react";

interface TestimonialType {
  id: number;
  customerName: string;
  reviewMessage: string;
  showOnHome: boolean;
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<TestimonialType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials/testimonial")
      .then((res) => res.json())
      .then((data) => {
        if (data.testimonials && data.testimonials.length > 0) {
          const filteredTestimonials = data.testimonials
            .filter((testimonial: TestimonialType) => testimonial.showOnHome)
            .slice(0, 3);
          setTestimonials(filteredTestimonials);
        }
      })
      .catch((error) => console.error("Error fetching testimonials:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-12 bg-white text-black">
      <div className="container mx-auto px-4 max-w-7xl md:px-0">
        <h2 className="text-3xl font-bold text-center mb-10">Testimonials</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {loading
            ? // Show shimmer effect while loading
              [...Array(3)].map((_, index) => <SkeletonTestimonial key={index} />)
            : // Show actual testimonials after loading
              testimonials.map((testimonial: TestimonialType) => (
                <div key={testimonial.id} className="bg-gray-50 p-6 rounded-lg shadow">
                  <p className="italic mb-4">&quot;{testimonial.reviewMessage}&quot;</p>
                  <div className="font-bold">{testimonial.customerName}</div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

// Skeleton Loader (Shimmer Effect)
function SkeletonTestimonial() {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow animate-pulse">
      <div className="h-4 w-3/4 bg-gray-300 rounded-md mb-4"></div>
      <div className="h-4 w-full bg-gray-300 rounded-md mb-2"></div>
      <div className="h-4 w-3/4 bg-gray-300 rounded-md mb-4"></div>
      <div className="h-4 w-full bg-gray-300 rounded-md mb-2"></div>
      <div className="h-4 w-5/6 bg-gray-300 rounded-md mb-2"></div>
      <div className="h-4 w-1/2 bg-gray-300 rounded-md mt-4"></div>
      <div className="h-4 w-full bg-gray-300 rounded-md mb-2"></div>
    </div>
  );
}
