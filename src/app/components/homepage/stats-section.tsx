export function StatsSection() {
  return (
    <section className="bg-yellow-500 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4">
            <h3 className="text-3xl md:text-4xl font-bold mb-2">100+</h3>
            <p className="text-sm md:text-base">Delighted Customers</p>
          </div>
          <div className="p-4">
            <h3 className="text-3xl md:text-4xl font-bold mb-2">28+</h3>
            <p className="text-sm md:text-base">Ongoing Projects</p>
          </div>
          <div className="p-4">
            <h3 className="text-3xl md:text-4xl font-bold mb-2">20+</h3>
            <p className="text-sm md:text-base">Years of Experience</p>
          </div>
          <div className="p-4">
            <h3 className="text-3xl md:text-4xl font-bold mb-2">100%</h3>
            <p className="text-sm md:text-base">Satisfied Customers</p>
          </div>
        </div>
      </div>
    </section>
  )
}

