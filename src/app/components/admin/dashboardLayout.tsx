"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./sidebar";
import HeaderLayout from "./header";
import FooterLayout from "./footer";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname() || "/dashboard"; // Ensure a default value
  const router = useRouter();

  const handleBack = () => {
    const historyStack = JSON.parse(sessionStorage.getItem("historyStack") || "[]");

    if (historyStack.length > 1) {
      historyStack.pop(); // Remove current page
      const prevPage = historyStack[historyStack.length - 1]; // Get new previous page
      sessionStorage.setItem("historyStack", JSON.stringify(historyStack));
      router.push(prevPage);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <HeaderLayout />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-6 rounded-tl-lg">
          {/* Page Content */}
          <div className="mt-6">{children}</div>
        </main>
      </div>
      {/* Footer */}
      <FooterLayout />
    </div>
  );
};

export default AdminLayout;
