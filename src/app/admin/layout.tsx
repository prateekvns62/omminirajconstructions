import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import "./globals.css";
import AdminLayout from "../components/admin/dashboardLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Om Miniraj Building &amp; Construction Services Private Limited",
  description:
    "Welcome to Om Miniraj Building and Construction Services Private Limited, your trusted partner in the world of construction and infrastructure development in India.",
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch the current session
  const session = await getServerSession(authOptions);

  // If no session, redirect to login page
  if (!session) {
    redirect("/login");
  }

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <AdminLayout>{children}</AdminLayout>
    </div>
  );
}
