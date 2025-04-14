import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#1F1F1F] text-[#9E9E9E] py-12">
      <div className="container max-w-7xl mx-auto px-6 md:px-12">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* First Section */}
          <div>
            <Image src="/logo.jpg" alt="Om Miniraj Logo" width={210} height={90} />
            <p className="text-sm mt-6 leading-relaxed">
              Welcome to Om Miniraj Building and Construction Services Private Limited,
              your trusted partner in the world of construction and infrastructure development in India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                ["/about-us", "About Us"],
                ["/construction-services", "Construction Services"],
                ["/gallery", "Gallery"],
                ["/our-clients", "Our Clients"],
                ["/career", "Careers"],
                ["/ongoing-projects", "Ongoing Projects"],
                ["/contact-us", "Contact Us"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <ul className="space-y-3">
              {[
                ["https://www.facebook.com/share/1EkczoEPpc/", FaFacebook, "Facebook"],
                ["https://www.instagram.com/omminirajbuildingconstruction", FaInstagram, "Instagram"],
                ["https://www.youtube.com/@omminirajbuildingandconstructi", FaYoutube, "YouTube"],
              ].map(([href, Icon, label]) => (
                <li key={href} className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-yellow-600" />
                  <Link href={href} className="hover:text-white transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {[
                ["Head Office: Shivaji Nagar, Pune, Maharashtra"],
                ["Regional Office: Hadapsar, Pune, Maharashtra"],
                ["Phone: +91 1234 567890"],
                ["Email: info@omminiraj.com"],
                ["Working Hours: Mon-Sat, 9:00 AM - 6:00 PM"],
              ].map(([info], index) => (
                <li key={index} className="flex gap-2 items-start">
                  <span className="text-yellow-400 mt-1">●</span>
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>Copyright © 2023 Om Miniraj Building & Construction Services</p>
        </div>
      </div>
    </footer>
  );
}
