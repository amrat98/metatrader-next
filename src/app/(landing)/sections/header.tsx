"use client";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { useContext } from "react";
import React, { useEffect, useState } from 'react';
import { UserContext } from "@/lib/usercontent";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Menu, MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
  {
    title: "About us",
    url: `${routes.home}`,
    active: true,
  },
  {
    title: "PAMM Investment",
    url: `${routes.home}`,
    active: false,
  },
  {
    title: "News",
    url: `${routes.home}`,
    active: false,
  },
  {
    title: "Calculator",
    url: `${routes.home}`,
    active: false,
  },
  {
    title: "Download PDF",
    url: `${routes.home}`,
    active: false,
  },
]

const navigationLinkClass=`relative text-base px-4 uppercase rounded-none border border-dashed border-transparent
                  hover:bg-sky-400/10 hover:text-primary hover:border-primary focus:bg-sky-400/10 focus:text-primary focus:border-primary
                  data-[active=true]:bg-sky-400/10 data-[active=true]:text-primary data-[active=true]:border-primary
                  data-[active=true]:hover:bg-sky-400/20 data-[active=true]:hover:text-primary data-[active=true]:hover:border-primary
                  data-[active=true]:focus:bg-sky-400/20 data-[active=true]:focus:text-primary group/item`;

const navigationBorderClass=`size-2 border-primary absolute transition-all opacity-0 group-hover/item:opacity-100`

export default function Header() {
  const { userToken } = useContext(UserContext) || {};
  
  const [hasToken, setHasToken] = useState(false);
  
  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (token) {
      setHasToken(true);
    }
  }, []);
  return (
    <header className="fixed top-0 w-full z-10  bg-background/60 backdrop-blur-md gap-5">
      <div className="container relative">
        <div className="flex py-6 gap-8 items-center">
        <Link href={routes.home} className="mr-auto">
          <Image
            className="w-full max-h-10"
            src="/new-logo.png"
            alt="IBC"
            width={660}
            height={115}
            priority
          />
        </Link>
        {/* <NavigationMenu className="hidden xl:flex">
          <NavigationMenuList className="gap-2">
            {navigation.map((item) => (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuLink asChild data-active={item.active} className={navigationLinkClass}>
                <Link href={item.url}>{item.title}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu> */}
        <Link href={routes.login} className="flex p-2 px-4 whitespace-nowrap items-center text-sm lg:text-base font-semibold uppercase border border-dashed bg-sky-400/10 text-primary border-primary relative  hover:bg-sky-400/30">
        Join Now
        <div className="animate-corner size-2 border-t-2 border-l-2 border-primary absolute -top-[var(--corner)] -left-[var(--corner)]"></div>
        <div className="animate-corner size-2 border-t-2 border-r-2 border-primary absolute -top-[var(--corner)] -right-[var(--corner)]"></div>
        <div className="animate-corner size-2 border-b-2 border-l-2 border-primary absolute -bottom-[var(--corner)] -left-[var(--corner)]"></div>
        <div className="animate-corner size-2 border-b-2 border-r-2 border-primary absolute -bottom-[var(--corner)] -right-[var(--corner)]"></div>
        </Link>
        <Sheet>
          <SheetTrigger className="hidden cursor-pointer p-1 xl:hidden hover:bg-primary/20 hover:text-primary"><MenuIcon className="size-7"/></SheetTrigger>
          <SheetContent className="w-full bg-card">
          <SheetHeader>
            <SheetTitle>
              <Link href={routes.home} className="mr-auto inline-block">
                <Image
                  className="w-auto max-h-10 pr-10"
                  src="/new-logo.png"
                  alt="IBC"
                  width={660}
                  height={115}
                  priority
                />
              </Link>
            </SheetTitle>
          </SheetHeader>
          <NavigationMenu orientation="vertical" className="max-w-full items-start justify-start sheet-nav overflow-auto pb-8">
            <NavigationMenuList className="gap-2 flex-col items-stretch p-4">
              {navigation.map((item) => (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuLink asChild className={navigationLinkClass}>
                  <Link href={item.url}>{item.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <NavigationMenuLink asChild data-active="true" className={navigationLinkClass}>
                  <Link href={routes.login}>Join Now</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </header>
  );
}
