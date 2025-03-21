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

  useEffect(() => {
    fetch("/api/testimonials/testimonial")
      .then((res) => res.json())
      .then((data) => {
        if (data.testimonials && data.testimonials.length > 0) {
          const filteredTestimonials = data.testimonials.filter((testimonial: TestimonialType) => testimonial.showOnHome).slice(0, 3);
          setTestimonials(filteredTestimonials);
        }
      })
      .catch((error) => console.error("Error fetching testimonials:", error));
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Testimonials</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial: TestimonialType) => (
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
