"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

export function AboutSection() {
  const router = useRouter();
  return (
    <section className="py-12 bg-white">
    <div className="container mx-auto px-4 max-w-7xl md:px-0">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <Image
            src="/about-om.jpg"
            alt="Construction Site"
            width={600}
            height={600}
            className="rounded-md"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4 text-black">About Om Miniraj Constructions</h2>
          <p className="text-gray-700 mb-6">
            Welcome to Om Miniraj Building and Construction Services Private Limited, 
            your trusted partner in the world of construction and infrastructure development in India. 
            We are a dynamic and forward-thinking company dedicated to transforming your construction dreams into reality.
          </p>
          <h3 className="text-xl font-bold mb-2 text-black">Our Mission</h3>
          <p className="text-gray-700 mb-6">
          At Om Miniraj, our mission is simple yet profound: 
          to deliver excellence in construction services that not only meet but exceed our clients’ 
          expectations. We are committed to creating sustainable, safe, 
          and aesthetically pleasing structures that contribute to the development and progress of India.
          </p>
          <h3 className="text-xl font-bold mb-2 text-black">Our Vision</h3>
          <p className="text-gray-700 mb-6">
            Our vision is to be the leading construction company in India, recognized for innovation, reliability, 
            and outstanding quality. We aim to set new industry standards by consistently delivering superior construction 
            solutions tailored to the unique needs of our clients.
          </p>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black hover:text-white flex py-6 px-6 sm:px-8 md:px-12 text-md transform transition-all duration-300 hover:scale-105 cursor-pointer"
          onClick={() => router.push("/about-us")}>
            READ MORE
          </Button>
        </div>
      </div>
    </div>
  </section>
  )
}
