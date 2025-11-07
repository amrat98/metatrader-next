"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import UserContextProvider from "@/lib/usercontent";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <UserContextProvider>
      <SidebarProvider className="bg-accent">
        <AppSidebar />
        <SidebarInset className="bg-transparent pb-20">
          <main className="h-full">
            <DashboardHeader />
            <div className=" xl:max-w-7xl mx-auto">{children}</div>
            {showScroll && (
            <Button
              onClick={scrollToTop}
              variant="primary"
              size="icon"

              className="fixed bottom-16 lg:bottom-6 right-6 z-50 rounded-full p-3 hover:bg-background"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-6 h-6" />
            </Button>
          )}
          </main>
        </SidebarInset>
        <MobileNav />
      </SidebarProvider>
    </UserContextProvider>
  );
}