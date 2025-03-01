"use client";
import { ReactNode, useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import Image from "next/image";
import Sidebar from "./sidebar";

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
            className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2"
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

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <header className="w-full bg-white p-4">
        <div className="container mx-auto flex justify-between items-center">
            <Image src="/logo.jpg" alt="Logo" width={100} height={40} className="h-auto" />
            <UserMenu />
        </div>
      </header>
      <div className="flex flex-1">
        <Sidebar/>
        <main className="flex-1 bg-gray-100 p-6 rounded-tl-lg">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
