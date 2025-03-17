"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react"; // Import signOut from NextAuth
import { User, Search, Settings, Key, LogOut } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Import useRouter
import Loader from "./loader";

const HeaderLayout = () => {
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(false);
  const pathname = usePathname() || "";

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    await signOut({ callbackUrl: "/login" });
  };

  const handleRedirect = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 500);    
  };

  useEffect(() => {
    setLoading(false); // Stop loading when route changes
  }, [pathname]);

  return (
    <header className="w-full bg-white p-4">
      <div className="container mx-auto flex justify-between items-center" onMouseLeave={() => setIsOpen(false)}>
        <Image src="/logo.jpg" alt="Logo" width={100} height={40} className="h-auto" />

        {/* Search Bar */}
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="relative flex items-center gap-4">
          {/* Greeting Message */}
          <span className="text-gray-700 font-medium">{greeting}</span>

          {/* User & Settings Icon */}
          <div
            className="flex items-center space-x-3 p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition duration-300 cursor-pointer"
            onMouseEnter={() => setIsOpen(true)}
          >
            <User size={24} className="text-blue-600" />
            <Settings size={24} className="text-gray-700" />
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div
              className="absolute right-0 mt-3 w-56 bg-white rounded-lg py-2 z-50 drop-shadow-xl"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
              style={{ top: "100%" }}
            >
              <Link href="/admin/profile" className="flex items-center px-4 py-2 hover:bg-gray-100 text-black" onClick={handleRedirect}>
                <User size={18} className="mr-2 text-blue-500" />
                Profile
              </Link>
              <Link href="/admin/profile/change-password" className="flex items-center px-4 py-2 hover:bg-gray-100 text-black" onClick={handleRedirect}>
                <Key size={18} className="mr-2 text-yellow-500" />
                Change Password
              </Link>
              <button
                onClick={handleLogout} // Logout Logic
                className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100 text-black"
              >
                <LogOut size={18} className="mr-2 text-red-500" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      {loading && (
        <Loader/>
      )}
    </header>
  );
};

export default HeaderLayout;
