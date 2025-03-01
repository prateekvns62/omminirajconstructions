"use client";
import { useState } from "react";
import Link from "next/link";
import { User, Search } from "lucide-react";
import Image from "next/image";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        onMouseEnter={() => setIsOpen(true)}
      >
        <User size={30} />
      </button>
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <Link href="/admin/profile" className="block px-4 py-2 hover:bg-gray-100">User</Link>
          <Link href="/admin/change-password" className="block px-4 py-2 hover:bg-gray-100">Change Password</Link>
          <Link href="/logout" className="block px-4 py-2 hover:bg-gray-100">Logout</Link>
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

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
};

export default HeaderLayout;
