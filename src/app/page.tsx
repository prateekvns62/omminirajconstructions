/* eslint-disable react/no-unescaped-entities */
import Image from "next/image"
import Link from "next/link"
import { Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { StatsSection } from "./components/homepage/stats-section"
import { ServicesSection } from "./components/homepage/services-section"
import { ContactSection } from "./components/homepage/contact-section"
import { PricingSection } from "./components/homepage/pricing-section"
import { TestimonialsSection } from "./components/homepage/testimonials-section"
import { CertificatesSection } from "./components/homepage/certificates-section"


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Header/Navigation */}
      <header className="bg-[#232122] py-2">
        <div className="container mx-auto flex items-center justify-evenly px-4">
          <div className="flex items-center">
            <Image
              src="/logo.jpg"
              alt="Om Miniraj Logo"
              width={120}
              height={50}
              className="mr-4"
            />
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="#" className="text-white font-medium">
              About Us
            </Link>
            <Link href="#" className="text-white font-medium">
              Our Services
            </Link>
            <Link href="#" className="text-white font-medium">
              Careers
            </Link>
            <Link href="#" className="text-white font-medium">
              Booking
            </Link>
            <Link href="#" className="text-white font-medium">
              Branches
            </Link>
            <Link href="#" className="text-white font-medium">
              Media Details
            </Link>
            <Link href="#" className="text-white font-medium">
              Contact
            </Link>
          </nav>
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black py-6">Join Our Franchise</Button>
        </div>
      </header>

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

      {/* Footer */}
      <footer className="bg-[#1A2B48] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/placeholder.svg?height=60&width=140"
                alt="Om Miniraj Logo"
                width={140}
                height={60}
                className="mb-4"
              />
              <p className="text-sm mb-4">
                Om Miniraj Building and Construction Services Private Limited is a trusted name in the world of
                construction, known for delivering high-quality projects on time.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Our Services
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Ongoing Projects
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Completed Projects
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Follow Us</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-blue-600 rounded-full"></span>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Facebook
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-pink-600 rounded-full"></span>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Instagram
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-blue-400 rounded-full"></span>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Twitter
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-red-600 rounded-full"></span>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    YouTube
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">●</span>
                  <span>Head Office: Shivaji Nagar, Pune, Maharashtra</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">●</span>
                  <span>Regional Office: Hadapsar, Pune, Maharashtra</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">●</span>
                  <span>Phone: +91 1234 567890</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">●</span>
                  <span>Email: info@omminiraj.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">●</span>
                  <span>Working Hours: Mon-Sat, 9:00 AM - 6:00 PM</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
            <p>Copyright © 2023 Om Miniraj Building & Construction Services</p>
          </div>
        </div>
      </footer>

      {/* Feedback Button */}
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2">
        <Button className="bg-red-600 hover:bg-red-700 text-white rotate-90 origin-right">FEEDBACK</Button>
      </div>
    </main>
  )
}

