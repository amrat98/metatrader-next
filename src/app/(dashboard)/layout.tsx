"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import UserContextProvider from "@/lib/usercontent";
import { useEffect, useState } from "react";
import { ArrowUp, TrendingUp } from "lucide-react";
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
      <SidebarProvider className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 meta-gradient">
        <AppSidebar />
        <SidebarInset className="bg-transparent pt-0 pb-10 lg:pt-6 lg:pb-6">
          <main className="h-full">
            {/* <DashboardHeader /> */}
            <div className="flex justify-between items-center gap-3 px-4 py-6 lg:hidden">
            <SidebarTrigger className="min-w-10 lg:min-w-0 lg:-ml-1 cursor-pointer meta-border meta-shine aspect-square h-auto" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-1 to-brand-2 flex items-center justify-center shadow-[0_0_20px_rgba(185,242,255,.15)]">
                <TrendingUp className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="font-bold text-base sm:text-lg bg-gradient-to-r from-brand-1 to-brand-2 bg-clip-text text-transparent">Billionaire's Blueprint</h1>
                <p className="text-xs text-muted-foreground">Premium Trading</p>
              </div>
            </div>
            <div className="min-w-10"></div>
            </div>
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