"use client";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function DeliverySection() {
  const router = useRouter();
  const defaultBackground = "/ommini-projects.jpg";

  return (
    <section
      className="relative w-full min-h-[40vh] md:min-h-[70vh] flex items-center justify-center text-center text-black font-bold text-xl md:text-4xl overflow-hidden"
      style={{
        backgroundImage: `url(${defaultBackground})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Yellow Overlay */}
      <div className="absolute inset-0 bg-yellow-500 opacity-60"></div>
      
      {/* Centered Content */}
      <div className="container mx-auto px-4 max-w-7xl md:px-0 relative z-10 my-6 min-h-[30vh] md:min-h-[50vh] max-h-[60vh] flex flex-col items-center justify-center text-center">
        <p className="text-xl md:text-3xl font-medium text-black-800 max-w-4xl">
          We understand the importance of on-time delivery. A project can only be a success if it is delivered on time. 
          Proper planning, budgeting, scheduling of raw materials to achieve on-time delivery and execution of the project 
          within the given time frame.
        </p>
        <Button 
          className="mt-8 bg-yellow-500 hover:bg-yellow-600 text-black flex items-center gap-2 p-6 text-base font-bold cursor-pointer"
          onClick={() => router.push("/contact-us")}
        >
          <Phone size={20} />
          REQUEST A CALL BACK!
        </Button>
      </div>
    </section>
  );
}
