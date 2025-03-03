"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Sidebar from "./sidebar";
import HeaderLayout from "./header";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname() || "/dashboard"; // Ensure a default value
  const router = useRouter();
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState<string>("Dashboard");

  useEffect(() => {
    const historyStack = JSON.parse(sessionStorage.getItem("historyStack") || "[]");

    if (historyStack.length === 0 || historyStack[historyStack.length - 1] !== pathname) {
      historyStack.push(pathname);
      sessionStorage.setItem("historyStack", JSON.stringify(historyStack));
    }

    // Set previous URL (second last in the stack)
    setPreviousUrl(historyStack.length > 1 ? historyStack[historyStack.length - 2] : null);

    // Fetch page title from localStorage or generate default title
    const storedTitle = localStorage.getItem(`pageTitle`);
    if (storedTitle) {
      setPageTitle(storedTitle);
    }
  }, [pathname]);

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
          {/* Header Section */}
          {pageTitle && pageTitle !== "Dashboard" && pageTitle !== "Admin" && (
            <div className="flex justify-between items-center py-4 border-b">
                <h4 className="text-2xl font-bold">{pageTitle} Records</h4>
                {previousUrl && (
                <button
                    onClick={handleBack}
                    className="flex items-center space-x-2 text-blue-600 hover:underline"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>
                )}
            </div>
            )}

          {/* Page Content */}
          <div className="mt-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
