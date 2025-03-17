export function TestimonialsSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Testimonials</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <p className="italic mb-4">
              &quot;Working with Om Miniraj for my home construction was a fantastic experience. Their attention to detail is
              remarkable. They delivered on time and within budget. I highly recommend their services to anyone looking
              for quality construction.&quot;
            </p>
            <div className="font-bold">Anushka Sharma</div>
            <div className="text-sm text-gray-600">Pune</div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <p className="italic mb-4">
              &quot;When we decided to build our office, Om Miniraj was the perfect choice. The challenge was to create a
              modern, functional space within a tight deadline. They not only met our expectations but exceeded them
              with their innovative solutions and professional approach.&quot;
            </p>
            <div className="font-bold">Sanjay Kumar</div>
            <div className="text-sm text-gray-600">Mumbai</div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <p className="italic mb-4">
              &quot;Om Miniraj made the construction process so smooth for us. Their team was responsive, transparent, and
              committed to quality. I was especially impressed with their attention to detail and how they suggested
              improvements to our original plans. Highly recommended!&quot;
            </p>
            <div className="font-bold">Deepak &amp; Priya</div>
            <div className="text-sm text-gray-600">Nagpur</div>
          </div>
        </div>
      </div>
    </section>
  );
}
