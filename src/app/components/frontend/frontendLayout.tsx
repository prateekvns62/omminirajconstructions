"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Footer from "./footer";
import Header from "./header";

const FrontEndLayout = ({ children }: { children: ReactNode }) => {

  return (
    <>
        <div className="flex flex-col h-screen">
            <Header/>
            <div>
                <main className="flex min-h-screen flex-col">{children}</main>
            </div>
            <Footer/>
        </div>
        {/* Feedback Button */}
        <div className="fixed right-0 top-1/2 transform -translate-y-1/2 mr-3">
            <Button className="bg-red-600 hover:bg-red-700 text-white rotate-90 origin-right">FEEDBACK</Button>
        </div>
    </>
  );
};

export default FrontEndLayout;