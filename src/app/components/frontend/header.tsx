"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [submenu, setSubmenu] = useState<{ branches: boolean; moreDetails: boolean }>({
    branches: false,
    moreDetails: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling
    }
  }, [isOpen]);

  return (
    <header className="bg-[#232122] relative z-50">
      <div className="hidden md:flex items-center bg-yellow-500 mx-auto">
        <div className="container flex items-center justify-between max-w-7xl mx-auto py-2 text-black text-sm">
          <span>CIN – U43299DL2023PTC413854</span>
          <span>Reg. No. – 413853</span>
          <span>Licence No – 156942</span>
          <span>Shop 15 Mini Central Market DDA Flats Kalkaji New Delhi Pin Code 110019</span>
        </div>
      </div>

      <div className="container flex items-center justify-between max-w-7xl mx-auto px-4 md:px-0 py-2">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image src="/logo.jpg" alt="Om Miniraj Logo" width={110} height={45} className="mr-4" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-5 text-md tracking-wide">
          <Link href="/" className="relative text-white font-medium after:absolute after:left-0 after:bottom-[-8px] after:w-full after:h-[2px] after:bg-yellow-400 after:opacity-0 hover:after:opacity-100 transition-all duration-300">Home</Link>
          <Link href="/about-us/" className="relative text-white font-medium after:absolute after:left-0 after:bottom-[-8px] after:w-full after:h-[2px] after:bg-yellow-400 after:opacity-0 hover:after:opacity-100 transition-all duration-300">About Us</Link>
          <Link href="/construction-services/" className="relative text-white font-medium after:absolute after:left-0 after:bottom-[-8px] after:w-full after:h-[2px] after:bg-yellow-400 after:opacity-0 hover:after:opacity-100 transition-all duration-300">Our Services</Link>
          <Link href="/career/" className="relative text-white font-medium after:absolute after:left-0 after:bottom-[-8px] after:w-full after:h-[2px] after:bg-yellow-400 after:opacity-0 hover:after:opacity-100 transition-all duration-300">Careers</Link>
          <Link href="/construction-booking/" className="relative text-white font-medium after:absolute after:left-0 after:bottom-[-8px] after:w-full after:h-[2px] after:bg-yellow-400 after:opacity-0 hover:after:opacity-100 transition-all duration-300">Booking</Link>

          <div className="relative group">
            <button className="text-white font-medium flex items-center space-x-1 border-b-2 border-transparent hover:border-yellow-400">
              <span>Branches</span> <ChevronDown size={16} />
            </button>
            <div className="absolute left-0 pt-6 w-64 bg-[#232122] shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-50">
              <div className="flex flex-col space-y-6 p-2">
                <Link href="/branches/" className="text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-all duration-300">All Branches</Link>
                <Link href="/branche/mahendragarh/" className="text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-all duration-300">Mahendragarh</Link>
                <Link href="/branche/rewari/" className="text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-all duration-300">Rewari</Link>
                <Link href="/branche/narnaul/" className="text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-all duration-300">Narnaul</Link>
                <Link href="/branche/behror/" className="text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-all duration-300">Behror</Link>
                <Link href="/branche/hapur/" className="text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-all duration-300">Hapur</Link>
                <Link href="/branche/gaziabad/" className="text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-all duration-300">Gaziabad</Link>
                <Link href="/branche/rajasthan/" className="text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-all duration-300">Thanagazi Alwar</Link>
              </div>
            </div>
          </div>

          {/* More Details Dropdown */}
          <div className="relative group">
            <button className="text-white font-medium flex items-center space-x-1 border-b-2 border-transparent hover:border-yellow-400">
              <span>More Details</span> <ChevronDown size={16} />
            </button>
            <div className="absolute left-0 pt-6 w-64 bg-[#232122] shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-50">
              <div className="flex flex-col space-y-6 p-2">
                <Link href="/gst/" className="text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-all duration-300">GST No.</Link>
                <Link href="/growth-chart/" className="text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-all duration-300">Growth Chart (2023-24)</Link>
                <Link href="/gallery/" className="text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-all duration-300">Gallery</Link>
                <Link href="/our-clients/" className="text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-all duration-300">Our Clients</Link>
                <Link href="/winners/" className="text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-all duration-300">Winners</Link>
                <Link href="/ongoing-projects/" className="text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-all duration-300">Ongoing Projects</Link>
                <Link target="_blank"rel="noopener noreferrer" href="/uploads/general/loan_agreement.pdf" className="text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-all duration-300">Loan Agreement</Link>
                <Link target="_blank"rel="noopener noreferrer" href="/uploads/general/customer_agreement.pdf" className="text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-all duration-300">Customer Agreement</Link>
                <Link target="_blank"rel="noopener noreferrer" href="/uploads/general/thekedar_agreement.pdf" className="text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-all duration-300">Thekedar Agreement</Link>
                <Link target="_blank"rel="noopener noreferrer" href="/uploads/general/details_of_material.pdf" className="text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-all duration-300">Details Of Material</Link>
                <Link target="_blank"rel="noopener noreferrer" href="/uploads/general/more_information.pdf" className="text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-all duration-300">More Information</Link>
                <Link target="_blank"rel="noopener noreferrer" href="https://sodium.scnservers.net/roundcube" className="text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-all duration-300">Staff Login</Link>
              </div>
            </div>
          </div>

          <Link href="/contact-us/" className="relative text-white font-medium after:absolute after:left-0 after:bottom-[-8px] after:w-full after:h-[2px] after:bg-yellow-400 after:opacity-0 hover:after:opacity-100 transition-all duration-300">Contact</Link>
        </nav>

        {/* Join Our Franchise Button (Hidden on mobile) */}
        <Button className="hidden md:flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-md text-black py-6 px-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 z-52 cursor-pointer"
            onClick={() => router.push("/franchise-form")}>
            Join Our Franchise
        </Button>


        {/* Mobile Menu Button */}
        <button className={`md:hidden bg-yellow-400 hover:bg-yellow-500 p-2 rounded text-black ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(!isOpen)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-opacity-75 z-40" onClick={() => setIsOpen(false)}></div>
      )}
      <div
        className={`fixed top-0 left-0 h-screen w-[75%] bg-[#232122] shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 overflow-y-auto pb-16`}
      >
        <div className="flex justify-between items-center px-4 py-4">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <Image src="/logo.jpg" alt="Om Miniraj Logo" width={100} height={40} />
          </Link>
          <button className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95" onClick={() => setIsOpen(false)}>
            <X size={28} />
          </button>
        </div>

        <nav className="flex flex-col space-y-6 px-6 mt-8 pb-16 overflow-y-auto">
          <Link href="/" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/about-us/" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95" onClick={() => setIsOpen(false)}>About Us</Link>
          <Link href="/construction-services/" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95" onClick={() => setIsOpen(false)}>Our Services</Link>
          <Link href="/career/" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95" onClick={() => setIsOpen(false)}>Careers</Link>
          <Link href="/construction-booking/" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95" onClick={() => setIsOpen(false)}>Booking</Link>

          {/* Branches Dropdown */}
          <button className={`text-white flex justify-between ${submenu.branches ? 'border-b-2 border-yellow-400' : ''}`} onClick={() => setSubmenu({ ...submenu, branches: !submenu.branches, moreDetails:false })}>
            Branches <ChevronDown size={16} />
          </button>
          {submenu.branches && (
            <div className="flex flex-col space-y-6 pl-4" onClick={() => setIsOpen(false)}>
              <Link href="/branches/" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95">All Branches</Link>
              <Link href="/branche/mahendragarh/" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95">Mahendragarh</Link>
              <Link href="/branche/rewari/" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95">Rewari</Link>
              <Link href="/branche/narnaul/" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95">Narnaul</Link>
              <Link href="/branche/behror/" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95">Behror</Link>
              <Link href="/branche/hapur/" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95">Hapur</Link>
              <Link href="/branche/gaziabad/" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95">Gaziabad</Link>
              <Link href="/branche/rajasthan/" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95">Thanagazi Alwar</Link>
            </div>
          )}

          {/* More Details Dropdown */}
            <button className={`text-white flex justify-between ${submenu.moreDetails ? 'border-b-2 border-yellow-400':''}`} onClick={() => setSubmenu({ ...submenu, moreDetails: !submenu.moreDetails,branches: false })}>
                <span>More Details</span> <ChevronDown size={16} />
            </button>
            {submenu.moreDetails && (
            <div className="flex flex-col space-y-6 p-2" onClick={() => setIsOpen(false)}>
                <Link href="/gst/" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95">GST No.</Link>
                <Link href="/growth-chart/" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95">Growth Chart</Link>
                <Link href="/gallery/" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95">Gallery</Link>
                <Link href="/our-clients/" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95">Our Clients</Link>
                <Link href="/winners/" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95">Winners</Link>
                <Link href="/ongoing-projects/" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95">Ongoing Projects</Link>
                <Link target="_blank"rel="noopener noreferrer" href="/uploads/general/loan_agreement.pdf" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95">Loan Agreement</Link>
                <Link target="_blank"rel="noopener noreferrer" href="/uploads/general/customer_agreement.pdf" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95">Customer Agreement</Link>
                <Link target="_blank"rel="noopener noreferrer" href="/uploads/general/thekedar_agreement.pdf" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95">Thekedar Agreement</Link>
                <Link target="_blank"rel="noopener noreferrer" href="/uploads/general/details_of_material.pdf" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95">Details Of Material</Link>
                <Link target="_blank"rel="noopener noreferrer" href="/uploads/general/more_information.pdf" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95">More Information</Link>
                <Link target="_blank"rel="noopener noreferrer" href="https://sodium.scnservers.net/roundcube" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95">Staff Login</Link>
            </div>
            )}
          <Link href="/contact-us/" className="text-white transition-all duration-200 ease-in-out transform hover:text-yellow-400 hover:scale-105 active:scale-95" onClick={() => setIsOpen(false)}>Contact</Link>
          <div className="pb-16">
            {/* Join Our Franchise Button (Hidden on mobile) */}
            <Button className="flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-md text-black py-6 px-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 z-52 cursor-pointer"
            onClick={() => router.push("/franchise-form")}>
                Join Our Franchise
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
