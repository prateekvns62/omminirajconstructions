import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-[#1A2B48] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/logo.jpg"
                alt="Om Miniraj Logo"
                width={140}
                height={60}
                className="mr-4"
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
                  <Link href="/construction-services" className="text-gray-300 hover:text-white">
                    Our Services
                  </Link>
                </li>
                <li>
                  <Link href="/career" className="text-gray-300 hover:text-white">
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
                  <Link href="/ongoing-projects" className="text-gray-300 hover:text-white">
                    Ongoing Projects
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
    );
}