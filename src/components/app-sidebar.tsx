"use client";

import * as React from "react";
import { Share2, Copy, House, Network, BanknoteArrowDown, BanknoteArrowUp, Wallet, Headset, CreditCard, LogOut, Gift, Gem } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { routes } from "@/lib/routes";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useContext, useState, Suspense } from "react";
import { UserContext } from "@/lib/usercontent";

import SharePopup from './share-popup';

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: `${routes.dashboard}`,
      icon: House,
      bgColor: "bg-gradient-to-br data-[active=true]:text-white hover:text-white hover:from-brand-4 hover:to-brand-5 data-[active=true]:from-brand-4 data-[active=true]:to-brand-5"
    },
    {
      title: "My Team",
      url: `${routes.team}`,
      icon: Network,
      bgColor: "bg-gradient-to-br data-[active=true]:text-white hover:text-white hover:from-brand-5 hover:to-brand-1  data-[active=true]:from-brand-5 data-[active=true]:to-brand-1"
    },
    {
      title: "My Investment",
      url: `${routes.investment}`,
      icon: BanknoteArrowDown,
      bgColor: "bg-gradient-to-br data-[active=true]:text-white hover:text-white hover:from-brand-3 hover:to-brand-5  data-[active=true]:from-brand-3 data-[active=true]:to-brand-5"
    },
    {
      title: "My Income",
      url: `${routes.income}`,
      icon: BanknoteArrowUp,
      bgColor: "bg-gradient-to-br data-[active=true]:text-white hover:text-white hover:from-brand-2 hover:to-brand-3  data-[active=true]:from-brand-2 data-[active=true]:to-brand-3"
    },
    {
      title: "Assets",
      url: `${routes.assets}`,
      icon: Wallet,
      bgColor: "bg-gradient-to-br data-[active=true]:text-white hover:text-white hover:from-brand-3 hover:to-brand-1  data-[active=true]:from-brand-3 data-[active=true]:to-brand-1"
    },
    {
      title: "My Subscription",
      url: `${routes.subscription}`,
      icon: CreditCard,
      bgColor: "bg-gradient-to-br data-[active=true]:text-white hover:text-white hover:from-brand-1 hover:to-brand-2  data-[active=true]:from-brand-1 data-[active=true]:to-brand-2"
    },
    {
      title: "Support",
      url: `${routes.support}`,
      icon: Headset,
      bgColor: "bg-gradient-to-br data-[active=true]:text-white hover:text-white hover:from-brand-1 hover:to-brand-5  data-[active=true]:from-brand-1 data-[active=true]:to-brand-5"
    },
  ],
};

function NavMain({ items }: { items: typeof data.navMain }) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleMenuClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <>
    <div className="px-3 pt-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider m-0">Menu</p>
    </div>
    <SidebarMenu className="p-3 pt-0">
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild
          className={`px-4 py-3 h-auto w-full font-semibold! group-data-[collapsible=icon]:size-full! group/item ${item.bgColor}`}
          data-active={pathname === item.url ? true : false}
          >
            <Link
              href={item.url}
              prefetch={pathname === item.url ? null : false}
              // className={`${pathname === item.url ? "bg-primary text-white hover:bg-primary hover:text-white" : ""}`}
              onClick={handleMenuClick}
            >
              <item.icon className="size-6! group-data-[collapsible=icon]:size-6! group-hover/item:scale-110 transition-transform" />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
    </>
  );
}

function NavUser() {
  const { profile } = useContext(UserContext) || {};
 
 // console.log(profile);
  
  // if (!profile) {
  //   return (
  //     <div className="flex items-center gap-2 border-b border-border py-3 px-5 bg-linear-90 from-primary/40 to-80% to-background group-data-[collapsible=icon]:px-1.5 group-data-[collapsible=icon]:justify-center">
  //       <Avatar className="size-7 lg:size-10 rounded-full">
  //         <AvatarFallback className="rounded-full bg-transparent">...</AvatarFallback>
  //       </Avatar>
  //       <div className="flex flex-col group-data-[collapsible=icon]:hidden">
  //         <span className="text-sm font-medium">Loading...</span>
  //         <span className="text-xs">Loading...</span>
  //       </div>
  //     </div>
  //   );
  // }

  const initials = `${profile?.userResult.firstName?.[0] || ''}${profile?.userResult.lastName?.[0] || ''}`;

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="py-3 px-5 group-data-[collapsible=icon]:px-1.5 group-data-[collapsible=icon]:justify-center">
      <div className="flex items-center gap-2 bg-brand-1/20 p-3 border-2 border-brand-1 rounded-xl">
      <Avatar className="size-7 lg:size-10 rounded-full">
        <AvatarImage src="/avatar.jpg" alt={profile?.userResult.nickName} />
        <AvatarFallback className="rounded-full">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col group-data-[collapsible=icon]:hidden">
        <span className="text-sm font-semibold truncate">{profile?.userResult.nickName}</span>
        {/* <span className="text-xs text-slate-500 truncate">{profile?.userResult.email}</span> */}
      </div>
    </div>
    </div>
    </Suspense>
  );
}

function NavDoc() {
  const { profile, globalasset } = useContext(UserContext) || {};
  const referralCodeA = profile?.userResult?.referralCodeA || '';
  const referralCodeB = profile?.userResult?.referralCodeB || '';
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const referralLinkA = `${baseUrl}${routes.register}?ref=${referralCodeA}`;
  const referralLinkB = `${baseUrl}${routes.register}?ref=${referralCodeB}`;
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [showTooltipB, setShowTooltipB] = React.useState(false);

  // Share popup state
  const [sharePopupOpen, setSharePopupOpen] = React.useState(false);
  const [shareLink, setShareLink] = React.useState<string>("");
  const initials = `${profile?.userResult.firstName?.[0] || ''}${profile?.userResult.lastName?.[0] || ''}`;

  const handleCopyA = () => {
    navigator.clipboard.writeText(referralLinkA);
    toast.success("Referral link A copied to clipboard!");
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 1000);
  };
  const handleCopyB = () => {
    navigator.clipboard.writeText(referralLinkB);
    toast.success("Referral link B copied to clipboard!");
    setShowTooltipB(true);
    setTimeout(() => {
      setShowTooltipB(false);
    }, 1000);
  };

  const handleShareA = () => {
    setShareLink(referralLinkA);
    setSharePopupOpen(true);
  };
  const handleShareB = () => {
    setShareLink(referralLinkB);
    setSharePopupOpen(true);
  };

  return (
      <Suspense fallback={<div>Loading...</div>}>
      <div className="py-3 px-5 group-data-[collapsible=icon]:px-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:hidden transition-opacity delay-300 group-data-[collapsible=icon]:delay-0 group-data-[collapsible=icon]:duration-0">
      <div className="bg-brand-1/20 p-3 border-1 border-brand-1 rounded-xl flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Avatar className="size-7 lg:size-10 rounded-full">
            <AvatarImage src="/avatar.jpg" alt={profile?.userResult.nickName} />
            <AvatarFallback className="rounded-full">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold truncate">{profile?.userResult.nickName}</span>
            {/* <span className="text-xs text-slate-500 truncate">{profile?.userResult.email}</span> */}
          </div>
        </div>
        <span className="text-xs font-semibold mt-4">Referral Links</span>
        <div className="flex items-center justify-between gap-2 transition-colors">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* <Gift className="w-3 h-3 text-[#b9f2ff] flex-shrink-0" /> */}
            <span className="text-xs">Team A:</span>
            <span className="text-xs font-mono text-brand-5 font-bold truncate">{referralCodeA}</span>
          </div>
          <div>
          <TooltipProvider>
            <Tooltip open={showTooltip}>
              <TooltipTrigger asChild className="">
                <Button
                  variant="primary"
                  size="icon"
                  className="size-6 rounded-sm shrink-0"
                  onClick={handleCopyA}
                  disabled={!referralCodeA}
                >
                  <Copy className="size-3" />
                  <span className="sr-only">Copy referral link</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copied</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="primary"
            size="icon"
            className="size-6 shrink-0 ml-1"
            onClick={handleShareA}
            disabled={!referralCodeA}
          >
            <Share2 className="size-3" />
            <span className="sr-only">Share referral code</span>
          </Button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 transition-colors">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* <Gift className="w-3 h-3 text-[#b9f2ff] flex-shrink-0" /> */}
            <span className="text-xs">Team B:</span>
            <span className="text-xs font-mono text-brand-5 font-bold truncate">{referralCodeB}</span>
          </div>
          <div>
          <TooltipProvider>
            <Tooltip open={showTooltipB}>
              <TooltipTrigger asChild className="">
                <Button
                  variant="primary"
                  size="icon"
                  className="size-6 rounded-sm shrink-0"
                  onClick={handleCopyB}
                  disabled={!referralCodeB}
                >
                  <Copy className="size-3" />
                  <span className="sr-only">Copy referral link</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copied</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="primary"
            size="icon"
            className="size-6 shrink-0 ml-1"
            onClick={handleShareB}
            disabled={!referralCodeB}
          >
            <Share2 className="size-3" />
            <span className="sr-only">Share referral code</span>
          </Button>
          </div>
        </div>
      </div>
      </div>
      <SharePopup open={sharePopupOpen} onClose={() => setSharePopupOpen(false)} link={shareLink} title="Join me on MetaTrader!" description="Register using my referral link." />
    </Suspense>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const router = useRouter();
  const { logout } = useContext(UserContext) || {};

  const handleLogout = () => {
    if (logout) {
      logout();
      router.push(routes.login);
    }
  };

  return (
    <Sidebar collapsible="icon" {...props} className="bg-background">
      <SidebarHeader className="min-h-18 items-center justify-center border-b border-border group-data-[collapsible=icon]:px-1.5">
        <SidebarMenu className="items-center">
        <SidebarMenuItem>
        <SidebarMenuButton asChild className="h-auto p-0 hover:bg-transparent">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-5 to-brand-3 flex items-center justify-center animate-float">
            <Gem className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg bg-gradient-to-r from-brand-3 to-brand-5 bg-clip-text text-transparent">MetaTrader</h1>
            <p className="text-xs text-slate-500">Premium Trading</p>
          </div>
        </div>
        </SidebarMenuButton>
        </SidebarMenuItem>
          {/* <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="p-0 hover:bg-background focus:bg-background active:bg-background group-data-[collapsible=icon]:!p-0 min-w-10"
            >
              <Link href={routes.dashboard} className="flex">
              <Image
                  className="h-16 w-auto mx-auto block object-contain"
                  src="/square-logo.png"
                  alt="IBC"
                  width={540}
                  height={540}
                  priority
                />
                <div className="items-center justify-center size-10 hidden group-data-[collapsible=icon]:flex">
                  <Image
                    className="w-full block"
                    src="/logo-icon.png"
                    alt="IBC"
                    width={100}
                    height={100}
                    priority
                  />
                </div>
                <Image
                  className="w-full max-h-12 mx-auto block group-data-[collapsible=icon]:hidden"
                  src="/logo.png"
                  alt="IBC"
                  width={336}
                  height={80}
                  priority
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem> */}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavUser /> */}
        <NavDoc />
      </SidebarContent>
      <SidebarFooter className="border-t border-border py-5">
      <Button  onClick={handleLogout}
          variant="outline"
          className="text-sm border-destructive border-2 text-destructive hover:bg-destructive hover:text-white whitespace-nowrap overflow-hidden">
          <LogOut />
          <span className="group-data-[collapsible=icon]:hidden">Logout</span>
          </Button>
      </SidebarFooter>
      {/* <SidebarFooter className="justify-center items-center border-t border-border py-3 px-5 group-data-[collapsible=icon]:opacity-0 transition-opacity delay-300 group-data-[collapsible=icon]:delay-0 group-data-[collapsible=icon]:duration-0">
        <p className="text-xs text-border">
          © 2025 IBC, All rights reserved
        </p>
      </SidebarFooter> */}
    </Sidebar>
  );
}
