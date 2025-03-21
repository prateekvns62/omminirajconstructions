"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import PageTitle from "./pageTitle";

interface ServiceType {
  id: number;
  serviceTitle: string;
  description: string;
  image: string;
  status: boolean;
  showOnHome: boolean;
}

export function ServicesSection() {
  const [services, setServices] = useState<ServiceType[]>([]);

  useEffect(() => {
    fetch("/api/services/services")
      .then((res) => res.json())
      .then((data) => {
        if (data.services && data.services.length > 0) {
          setServices(data.services); // Show all services
        }
      })
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  return (
    <>
      <PageTitle title="Construction Services" />
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-4">Our Services</h2>
        <p className="text-center text-lg text-gray-700 mb-10">
          Om Miniraj Building and Construction Services Private Limited offers a comprehensive range of construction services, including but not limited to:
        </p>

          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
            {services.length > 0 ? (
              services.map((service) => (
                <div
                  key={service.id}
                  className="border rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
                >
                  <div className="relative w-full h-auto">
                    <Image
                      src={service.image || "/placeholder.svg?height=200&width=400"}
                      alt={service.serviceTitle}
                      width={400}
                      height={200}
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{service.serviceTitle}</h3>
                    <p className="text-gray-700 mb-4">{service.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500">No services available</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
