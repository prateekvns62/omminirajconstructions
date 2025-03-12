import { Geist, Geist_Mono } from "next/font/google";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch the current session
  const session = await getServerSession(authOptions);

  // If no session, redirect to login page
  if (session) {
    redirect("/admin");
  }

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      {children}
    </div>
  );
}
