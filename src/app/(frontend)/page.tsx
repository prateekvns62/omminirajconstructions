/* eslint-disable react/no-unescaped-entities */
import Image from "next/image"
import Link from "next/link"
import { Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { StatsSection } from "../components/homepage/stats-section"
import { ServicesSection } from "../components/homepage/services-section"
import { ContactSection } from "../components/homepage/contact-section"
import { PricingSection } from "../components/homepage/pricing-section"
import { TestimonialsSection } from "../components/homepage/testimonials-section"
import { CertificatesSection } from "../components/homepage/certificates-section"


export default function Home() {
  return (
    <>

      {/* Hero Section */}
      <section className="relative h-[400px]">
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
        <div className="relative container mx-auto px-[100px] h-full flex flex-col justify-center">
          <h2 className="text-2xl text-yellow-400 font-bold mb-2">सोचो सबसे सबसे अच्छा</h2>
          <h1 className="text-3xl md:text-4xl text-white font-bold mb-2">THINK INFRASTRUCTURE</h1>
          <h1 className="text-3xl md:text-4xl text-white font-bold mb-2">
            THINK <span className="text-yellow-400">OM MINIRAJ</span> BUILDING AND
          </h1>
          <h1 className="text-3xl md:text-4xl text-white font-bold mb-6">CONSTRUCTION SERVICES PVT. LTD.</h1>
          <p className="text-white mb-8">Best Building Constructions</p>
          <div>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black flex items-center gap-2">
              <Phone size={16} />
              CONTACT NOW
            </Button>
          </div>
        </div>
      </section>


      {/* About Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Image
                src="/placeholder.svg?height=300&width=500"
                alt="Construction Site"
                width={500}
                height={300}
                className="rounded-md"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">About Om Miniraj Constructions</h2>
              <p className="text-gray-700 mb-4">
                Welcome to Om Miniraj Building and Construction Services Private Limited, where we specialize in
                delivering exceptional construction and infrastructure development projects. We are a dynamic and
                trusted building company dedicated to transforming your construction dreams into reality.
              </p>
              <h3 className="text-xl font-bold mb-2">Our Expertise</h3>
              <p className="text-gray-700 mb-4">
                At Om Miniraj, our mission is simple but profound: to deliver excellence in construction services that
                not only meet but exceed our clients' expectations. With a team of skilled professionals and a
                commitment to sustainable planning practices that contribute to the development and growth of our
                nation.
              </p>
              <h3 className="text-xl font-bold mb-2">Our Vision</h3>
              <p className="text-gray-700 mb-4">
                Our vision is to be the leading construction company in India, recognized for our integrity, quality,
                and innovation. We strive to create sustainable structures that stand the testament of time as a lasting
                symbol of trust.
              </p>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">READ MORE</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection/>

      {/* Services Section */}
      <ServicesSection />

      {/* Contact Information Section */}
      <ContactSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Delivery Statement */}
      <section className="py-12 bg-yellow-100">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl md:text-2xl font-medium text-gray-800 max-w-4xl mx-auto">
            We understand the importance of on-time delivery. A project can only be a success if it is delivered on
            time. Proper planning, budgeting, scheduling of raw materials to achieve on-time delivery and execution of
            the project within the given time frame.
          </p>
          <Button className="mt-8 bg-yellow-500 hover:bg-yellow-600 text-black flex items-center gap-2 mx-auto">
            <Phone size={16} />
            REQUEST A CALL BACK
          </Button>
        </div>
      </section>

      {/* Certificates Section */}
      <CertificatesSection />
    </>
  )
}

