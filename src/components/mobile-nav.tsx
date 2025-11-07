"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";
import Link from "next/link";
import {
  House, Network, BanknoteArrowDown, BanknoteArrowUp, Wallet, Headset, CreditCard
} from "lucide-react";
  
  const data = {
    navMobile: [
      {
        title: "Dashboard",
        url: `${routes.dashboard}`,
        icon: House,
      },
      {
        title: "My Team",
        url: `${routes.team}`,
        icon: Network,
      },
      {
        title: "My Investment",
        url: `${routes.investment}`,
        icon: BanknoteArrowDown,
      },
      {
        title: "My Income",
        url: `${routes.income}`,
        icon: BanknoteArrowUp,
      },
      {
        title: "Assets",
        url: `${routes.assets}`,
        icon: Wallet,
      },
      {
        title: "My Subscription",
        url: `${routes.subscription}`,
        icon: CreditCard,
      },
      {
        title: "Support",
        url: `${routes.support}`,
        icon: Headset,
      },
    ],
  };

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background lg:hidden">
      <div className="flex justify-around items-center">
        {data.navMobile.map((item) => (
          <Link
            key={item.title}
            href={item.url}
            prefetch={pathname === item.url ? null : false}
            className={`flex flex-col items-center gap-1 py-4 p-2 ${
              pathname === item.url ? "text-primary" : "text-foreground"
            }`}
          >
            <item.icon className="size-6" />
            <span  className="sr-only">{item.title}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}


