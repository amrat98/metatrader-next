"use client";

import * as React from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";
import Link from "next/link";
interface PageInfo {
  title: string;
  subtitle: string;
}

const pageConfig: Record<string, PageInfo> = {
  [routes.dashboard]: {
    title: "Dashboard",
    subtitle: "Welcome back — Let's get back to building your success.",
  },
  [routes.team]: {
    title: "My Team",
    subtitle:
      "Team IBC — Track your network and collective business impact.",
  },
  [routes.investment]: {
    title: "My Investment",
    subtitle: "Track and manage your investment portfolio.",
  },
  [routes.income]: {
    title: "My Income",
    subtitle: "View your earnings and income history.",
  },
  [routes.assets]: {
    title: "Assets",
    subtitle: "Manage and track your assets.",
  },
  [routes.support]: {
    title: "Support",
    subtitle: "Get help and contact our support team.",
  },
  [routes.profile]: {
    title: "User Profile",
    subtitle: "Manage your account settings and preferences.",
  },
  [routes.subscription]: {
    title: "My Subscription",
    subtitle: "Manage your subscription and plan.",
  },
};

export function DashboardHeader() {
  const pathname = usePathname();
  const pageInfo = pageConfig[pathname] || {
    title: "Dashboard",
    subtitle: "Welcome back — Let's get back to building your success.",
  };

  return (
    <header className="sticky top-0 z-50 flex min-h-18 shrink-0 items-center gap-2 border-b border-border backdrop-blur supports-[backdrop-filter]:bg-white px-6 py-3 justify-between">
      <div className="flex-1 lg:hidden">
      <SidebarTrigger className="min-w-10 lg:min-w-0 lg:-ml-1 cursor-pointer bg-brand-2 aspect-square h-auto" />
      </div>
      {/* <Separator
        orientation="vertical"
        className="inline-flex mr-2 data-[orientation=vertical]:h-4 lg:hidden"
      /> */}
      <div className="lg:hidden">
        <Link href={routes.dashboard}>
        <Image
          className="w-full max-w-20 mx-auto"
          src="/logo.png"
          alt="IBC"
          width={336}
          height={80}
          priority
        />
        </Link>
      </div>
      <div className="hidden lg:flex flex-col">
        <h1 className="font-semibold text-base">{pageInfo.title}</h1>
        <p className="text-xs text-muted-foreground">{pageInfo.subtitle}</p>
      </div>
      <div className="flex-1 flex justify-end">
        <NavUser />
      </div>
    </header>
  );
}
