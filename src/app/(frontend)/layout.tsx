import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FrontEndLayout from "../components/frontend/frontendLayout";

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

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <FrontEndLayout>{children}</FrontEndLayout>
    </div>
  );
}
