"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/services/services")
      .then((res) => res.json())
      .then((data) => {
        if (data.services && data.services.length > 0) {
          const filteredServices = data.services
            .filter((service: ServiceType) => service.showOnHome)
            .slice(0, 3);
          setServices(filteredServices);
        }
      })
      .catch((error) => console.error("Error fetching services:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-12 bg-white text-black">
      <div className="container mx-auto px-4 max-w-7xl md:px-0">
        <h2 className="text-3xl font-bold text-center mb-10">We Provide Superior Construction Services</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {loading
            ? // Show shimmer effect while loading
              [...Array(3)].map((_, index) => <SkeletonService key={index} />)
            : // Show actual services after loading
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
              ))}
        </div>

        <div className="text-center mt-10">
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black h-14 text-md tracking-wide uppercase cursor-pointer"
          onClick={() => router.push("/construction-services")}>
            KNOW MORE ABOUT OUR SERVICES
          </Button>
        </div>
      </div>
    </section>
  );
}

// Skeleton Loader (Shimmer Effect)
function SkeletonService() {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg animate-pulse">
      <div className="w-full h-[300px] bg-gray-300"></div>
      <div className="p-4">
        <div className="h-5 w-3/4 bg-gray-300 rounded-md mb-2"></div>
        <div className="h-3 w-full bg-gray-300 rounded-md mb-2"></div>
        <div className="h-3 w-5/6 bg-gray-300 rounded-md"></div>
      </div>
    </div>
  );
}
