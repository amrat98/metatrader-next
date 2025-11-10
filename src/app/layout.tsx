import "./globals.css";
import type { Metadata } from "next";
import { Poppins, Michroma } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["italic", "normal"],
  subsets: ["latin"],
});

const michroma = Michroma({
  variable: "--font-michroma",
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Metatrader - Trade Smartly & Securely",
  description:
    "Welcome to Metatrader. Your all-in-one platform for smart, secure, and fast trading. Join now and take control of your investments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={`dark ${poppins.className}`}>
      <body className="antialiased"> 
        {children}
        <Toaster position="top-center" theme="light" />
      </body>
    </html>
  );
}

