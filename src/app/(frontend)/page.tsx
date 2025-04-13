/* eslint-disable react/no-unescaped-entities */
import Image from "next/image"
import { Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { StatsSection } from "../components/homepage/stats-section"
import { ServicesSection } from "../components/homepage/services-section"
import { ContactSection } from "../components/homepage/contact-section"
import { PricingSection } from "../components/homepage/pricing-section"
import { TestimonialsSection } from "../components/homepage/testimonials-section"
import { CertificatesSection } from "../components/homepage/certificates-section"
import { HeroSection } from "../components/homepage/hero-section"
import { AboutSection } from "../components/homepage/about-section"
import { DeliverySection } from "../components/homepage/delivery-message"


export default function Home() {
  return (
    <>

      {/* Hero Section */}
      <HeroSection/>


      {/* About Section */}
      <AboutSection/>

      {/* Stats Section */}
      <StatsSection/>

      {/* Services Section */}
      <ServicesSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Delivery Statement */}
      <DeliverySection/>

      {/* Certificates Section */}
      <CertificatesSection />
    </>
  )
}

