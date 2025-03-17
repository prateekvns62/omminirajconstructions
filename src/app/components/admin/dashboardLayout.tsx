"use client";

import { ReactNode } from "react";
import Sidebar from "./sidebar";
import HeaderLayout from "./header";
import FooterLayout from "./footer";

const AdminLayout = ({ children }: { children: ReactNode }) => {

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
