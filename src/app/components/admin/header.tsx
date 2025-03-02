"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Search, Settings, Key, LogOut } from "lucide-react";
import Image from "next/image";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [greeting, setGreeting] = useState("");

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

  return (
    <div className="relative flex items-center gap-3">
      {/* Greeting Message */}
      <span className="text-gray-700 font-medium">{greeting}</span>

      {/* User & Settings in One Rounded Box */}
      <div
        className="flex items-center space-x-3 p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition duration-300 cursor-pointer"
        onMouseEnter={() => setIsOpen(true)}
      >
        <User size={24} className="text-blue-600" />
        <Settings size={24} className="text-gray-700" />
      </div>

      {isOpen && (
        <div
          className="absolute right-0 mt-3 w-56 bg-white rounded-lg py-2 z-50 drop-shadow-xl"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          style={{ top: "100%" }} // Ensures dropdown appears below the icon
        >
          <Link href="/admin/profile" className="flex items-center px-4 py-2 hover:bg-gray-100">
            <User size={18} className="mr-2 text-blue-500" />
            User
          </Link>
          <Link href="/admin/change-password" className="flex items-center px-4 py-2 hover:bg-gray-100">
            <Key size={18} className="mr-2 text-yellow-500" />
            Change Password
          </Link>
          <Link href="/logout" className="flex items-center px-4 py-2 hover:bg-gray-100">
            <LogOut size={18} className="mr-2 text-red-500" />
            Logout
          </Link>
        </div>
      )}
    </div>
  );
};

const HeaderLayout = () => {
  const [searchText, setSearchText] = useState("");

  return (
    <header className="w-full bg-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Image src="/logo.jpg" alt="Logo" width={100} height={40} className="h-auto" />

        {/* Search Bar (Same as Previous) */}
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

        {/* User Menu with Greeting */}
        <UserMenu />
      </div>
    </header>
  );
};

export default HeaderLayout;
