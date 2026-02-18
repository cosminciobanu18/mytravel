import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HeroUIProvider } from "@heroui/react";
import NavComponent from "@/components/navComponent";
import AuthProvider from "./providers/authProvider";
import { ToastContainer } from "react-toastify";
import { getUserByEmail } from "@/lib/actions/actions";
import { getServerSession } from "next-auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MyTravel",
  description: "Track and explore your travels",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-green-50 min-h-full`}
      >
        <AuthProvider>
          <HeroUIProvider>
            <NavComponent />
            {children}
            <ToastContainer />
          </HeroUIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
