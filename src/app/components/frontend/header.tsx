"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [submenu, setSubmenu] = useState<{ branches: boolean; moreDetails: boolean }>({
    branches: false,
    moreDetails: false,
  });

  return (
    <header className="bg-[#232122] py-2 relative z-50">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image src="/logo.jpg" alt="Om Miniraj Logo" width={120} height={50} className="mr-4" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-4 text-lg">
          <Link href="/" className="relative text-white font-medium after:absolute after:left-0 after:bottom-[-8px] after:w-full after:h-[2px] after:bg-yellow-400 after:opacity-0 hover:after:opacity-100 transition-all duration-300">Home</Link>
          <Link href="/about-us/" className="relative text-white font-medium after:absolute after:left-0 after:bottom-[-8px] after:w-full after:h-[2px] after:bg-yellow-400 after:opacity-0 hover:after:opacity-100 transition-all duration-300">About Us</Link>
          <Link href="/construction-services/" className="relative text-white font-medium after:absolute after:left-0 after:bottom-[-8px] after:w-full after:h-[2px] after:bg-yellow-400 after:opacity-0 hover:after:opacity-100 transition-all duration-300">Our Services</Link>
          <Link href="/career/" className="relative text-white font-medium after:absolute after:left-0 after:bottom-[-8px] after:w-full after:h-[2px] after:bg-yellow-400 after:opacity-0 hover:after:opacity-100 transition-all duration-300">Careers</Link>
          <Link href="/construction-booking/" className="relative text-white font-medium after:absolute after:left-0 after:bottom-[-8px] after:w-full after:h-[2px] after:bg-yellow-400 after:opacity-0 hover:after:opacity-100 transition-all duration-300">Booking</Link>

          {/* Branches Dropdown */}
          <div className="relative group">
            <button className="text-white font-medium flex items-center space-x-1 border-b-2 border-transparent hover:border-yellow-400">
              <span>Branches</span> <ChevronDown size={16} />
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-[#232122] shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
              <div className="flex flex-col space-y-2 p-2">
                <Link href="/branches/" className="text-white">All Branches</Link>
                <Link href="/branche/mahendragarh/" className="text-white">Mahendragarh</Link>
                <Link href="/branche/rewari/" className="text-white">Rewari</Link>
                <Link href="/branche/narnaul/" className="text-white">Narnaul</Link>
                <Link href="/branche/behror/" className="text-white">Behror</Link>
                <Link href="/branche/hapur/" className="text-white">Hapur</Link>
                <Link href="/branche/gaziabad/" className="text-white">Gaziabad</Link>
                <Link href="/branche/rajasthan/" className="text-white">Thanagazi Alwar (Rajasthan)</Link>
              </div>
            </div>
          </div>

          {/* More Details Dropdown */}
          <div className="relative group">
            <button className="text-white font-medium flex items-center space-x-1 border-b-2 border-transparent hover:border-yellow-400">
              <span>More Details</span> <ChevronDown size={16} />
            </button>
            <div className="absolute left-0 mt-2 w-64 bg-[#232122] shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
              <div className="flex flex-col space-y-2 p-2">
                <Link href="/gst/" className="text-white">GST No.</Link>
                <Link href="/growth-chart/" className="text-white">Growth Chart</Link>
                <Link href="/gallery/" className="text-white">Gallery</Link>
                <Link href="/our-clients/" className="text-white">Our Clients</Link>
                <Link href="/winners/" className="text-white">Winners</Link>
                <Link href="/ongoing-projects/" className="text-white">Ongoing Projects</Link>
                <Link href="/uploads/2024/05/loan-agreement.pdf" className="text-white">Loan Agreement</Link>
                <Link href="/uploads/2024/04/customer-agreement.pdf" className="text-white">Customer Agreement</Link>
                <Link href="/uploads/2025/02/thekedar-terms.pdf" className="text-white">Thekedar Agreement</Link>
                <Link href="/uploads/2023/10/details-of-material.pdf" className="text-white">Details Of Material</Link>
                <Link href="/uploads/2023/10/more-information.pdf" className="text-white">More Information</Link>
                <Link href="https://sodium.scnservers.net/roundcube" className="text-white">Staff Login</Link>
              </div>
            </div>
          </div>

          <Link href="/contact-us/" className="relative text-white font-medium after:absolute after:left-0 after:bottom-[-8px] after:w-full after:h-[2px] after:bg-yellow-400 after:opacity-0 hover:after:opacity-100 transition-all duration-300">Contact</Link>
        </nav>

        {/* Join Our Franchise Button (Hidden on mobile) */}
        <Button className="hidden md:block bg-yellow-400 hover:bg-yellow-500 text-black py-6">
            Join Our Franchise
        </Button>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-40" onClick={() => setIsOpen(false)}></div>
      )}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#232122] shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex justify-between items-center px-4 py-4">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <Image src="/logo.jpg" alt="Om Miniraj Logo" width={100} height={40} />
          </Link>
          <button className="text-white" onClick={() => setIsOpen(false)}>
            <X size={28} />
          </button>
        </div>

        <nav className="flex flex-col space-y-4 px-6 mt-4">
          <Link href="/" className="text-white" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/about-us/" className="text-white" onClick={() => setIsOpen(false)}>About Us</Link>
          <Link href="/construction-services/" className="text-white" onClick={() => setIsOpen(false)}>Our Services</Link>
          <Link href="/career/" className="text-white" onClick={() => setIsOpen(false)}>Careers</Link>
          <Link href="/construction-booking/" className="text-white" onClick={() => setIsOpen(false)}>Booking</Link>

          {/* Branches Dropdown */}
          <button className="text-white flex justify-between" onClick={() => setSubmenu({ ...submenu, branches: !submenu.branches })}>
            Branches <ChevronDown size={16} />
          </button>
          {submenu.branches && (
            <div className="flex flex-col space-y-2 pl-4">
              <Link href="/branches/" className="text-white">All Branches</Link>
              <Link href="/branche/mahendragarh/" className="text-white">Mahendragarh</Link>
              <Link href="/branche/rewari/" className="text-white">Rewari</Link>
              <Link href="/branche/narnaul/" className="text-white">Narnaul</Link>
              <Link href="/branche/behror/" className="text-white">Behror</Link>
              <Link href="/branche/hapur/" className="text-white">Hapur</Link>
              <Link href="/branche/gaziabad/" className="text-white">Gaziabad</Link>
              <Link href="/branche/rajasthan/" className="text-white">Thanagazi Alwar</Link>
            </div>
          )}

          {/* More Details Dropdown */}
            <button className="text-white flex justify-between" onClick={() => setSubmenu({ ...submenu, moreDetails: !submenu.moreDetails })}>
                <span>More Details</span> <ChevronDown size={16} />
            </button>
            {submenu.moreDetails && (
            <div className="flex flex-col space-y-2 p-2">
                <Link href="/gst/" className="text-white">GST No.</Link>
                <Link href="/growth-chart/" className="text-white">Growth Chart</Link>
                <Link href="/gallery/" className="text-white">Gallery</Link>
                <Link href="/our-clients/" className="text-white">Our Clients</Link>
                <Link href="/winners/" className="text-white">Winners</Link>
                <Link href="/ongoing-projects/" className="text-white">Ongoing Projects</Link>
                <Link href="/uploads/2024/05/om-miniraj-building-and-construction-services-pvt-ltd-mortrage-loan-agreement.pdf" className="text-white">Loan Agreement</Link>
                <Link href="/uploads/2024/04/Customer-Agreement-2024.pdf" className="text-white">Customer Agreement</Link>
                <Link href="/uploads/2025/02/Thekedar-Terms-.pdf" className="text-white">Thekedar Agreement</Link>
                <Link href="/uploads/2023/10/Details-Of-Material.pdf" className="text-white">Details Of Material</Link>
                <Link href="/uploads/2023/10/More-Information.pdf" className="text-white">More Information</Link>
                <Link href="https://sodium.scnservers.net/roundcube" className="text-white">Staff Login</Link>
            </div>
            )}
          <Link href="/contact-us/" className="text-white" onClick={() => setIsOpen(false)}>Contact</Link>
        </nav>
      </div>
    </header>
  );
}
