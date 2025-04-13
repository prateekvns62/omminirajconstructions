"use client";
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const router = useRouter();
  return (
    <section className="relative h-[400px] md:h-[600px]">
      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover brightness-50"
      >
        <source src="/omniraj-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Content */}
      <div className="relative container mx-auto h-full flex flex-col justify-center max-w-7xl px-6 py-12 md:px-0">
        <p className="text-xl md:text-4xl text-white font-bold mb-1 md:mb-2">
          सबसे सस्ता <span className="text-yellow-400">सबसे अच्छा</span>
        </p>
        <h1 className="text-xl md:text-4xl text-white font-bold mb-1 md:mb-2">
          THINK INFRASTRUCTURE.
        </h1>
        <h1 className="text-xl md:text-4xl text-white font-bold mb-1 md:mb-2">
          THINK <span className="text-yellow-400">OM MINIRAJ</span> BUILDING AND
        </h1>
        <h1 className="text-xl md:text-4xl text-white font-bold mb-2 md:mb-4">
          CONSTRUCTION SERVICES PVT. LTD.
        </h1>
        <p className="text-lg md:text-xl text-white mb-8">Best Building Constructions</p>
        <div>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black flex items-center gap-2 py-6 px-12 text-sm font-bold cursor-pointer"
            onClick={() => router.push("/contact-us")}>
            <Phone size={16} />
            CONTACT NOW
          </Button>
        </div>
      </div>
    </section>
  )
}
