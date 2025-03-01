"use client";
import { ReactNode, useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import Image from "next/image";
import Sidebar from "./sidebar";
import HeaderLayout from "./header";


const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <HeaderLayout/>
      <div className="flex flex-1">
        <Sidebar/>
        <main className="flex-1 bg-gray-100 p-6 rounded-tl-lg">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
