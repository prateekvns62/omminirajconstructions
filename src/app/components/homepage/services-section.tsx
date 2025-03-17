import Image from "next/image"
import { Button } from "@/components/ui/button"

export function ServicesSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">We Provide Superior Construction Services</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Residential Construction */}
          <div className="border rounded-lg overflow-hidden shadow-md">
            <div className="h-48 relative">
              <Image
                src="/placeholder.svg?height=200&width=400"
                alt="Residential Construction"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">Residential Construction</h3>
              <p className="text-gray-700 mb-4">
                From luxury villas to affordable housing, we create beautiful, functional, and durable residential
                spaces.
              </p>
            </div>
          </div>

          {/* Commercial Construction */}
          <div className="border rounded-lg overflow-hidden shadow-md">
            <div className="h-48 relative">
              <Image
                src="/placeholder.svg?height=200&width=400"
                alt="Commercial Construction"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">Commercial Construction</h3>
              <p className="text-gray-700 mb-4">
                We specialize in building commercial spaces that are functional, aesthetically pleasing, and designed to
                grow with your business.
              </p>
            </div>
          </div>

          {/* Infrastructure Development */}
          <div className="border rounded-lg overflow-hidden shadow-md">
            <div className="h-48 relative">
              <Image
                src="/placeholder.svg?height=200&width=400"
                alt="Infrastructure Development"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">Infrastructure Development</h3>
              <p className="text-gray-700 mb-4">
                Our expertise extends to complex infrastructure projects such as roads, bridges, and public facilities.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">EXPLORE OUR SERVICES</Button>
        </div>
      </div>
    </section>
  )
}

