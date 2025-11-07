"use client";

import {
  BadgeCheck,
  ChevronDown,
  LogOut,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { routes } from "@/lib/routes";
import { useContext } from "react";
import { UserContext } from "@/lib/usercontent";
import { useRouter } from "next/navigation";

export function NavUser() {
  const router = useRouter();
  const { profile, userRank, logout } = useContext(UserContext) || {};
  const initials = `${profile?.userResult.firstName?.[0] || ''}${profile?.userResult.lastName?.[0] || ''}`;

  const rankToImage = {
    Bronze: "/ranks/bronze.png",
    Silver: "/ranks/silver.png",
    Gold: "/ranks/gold.png",
    Platinum: "/ranks/platinum.png",
    Diamond: "/ranks/diamond.png",
    King: "/ranks/king.png",
    "Royal King": "/ranks/royalKing.png",
  };

  const rankImage = userRank && userRank.toString() !== "Not Available" ? rankToImage[userRank as unknown as keyof typeof rankToImage] : null;
  
  const handleLogout = () => {
    if (logout) {
      logout();
      router.push(routes.login);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer">
        <Avatar className="size-9 lg:size-10 rounded-full">
        <AvatarImage src="/avatar.jpg" alt={profile?.userResult ? `${profile.userResult.nickName}` : 'Loading...'} />
          <AvatarFallback className="rounded-full bg-transparent">
            {profile?.userResult ? initials : '...'}
          </AvatarFallback>
        </Avatar>
        <div className="sm:grid flex-1 text-left text-sm leading-tight hidden">
          <span className="truncate font-semibold">
            {profile?.userResult?.nickName || 'Loading...'}
          </span>
          <span className="truncate text-xs">
            {profile?.userResult ? `${profile.userResult.firstName} ${profile.userResult.lastName}` : 'Loading...'}
          </span>
        </div>
        <ChevronDown className="ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border-border bg-background"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        {rankImage && (
          <>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm ">
                <div className="grid text-left text-sm leading-tight">
                  <span className="text-base font-bold text-primary"><span className="text-foreground font-semibold">My Rank - </span>{userRank}</span>
                </div>
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={rankImage} alt={userRank?.toString() || 'Rank'} />
                  <AvatarFallback className="rounded-lg bg-transparent">{userRank?.toString() || 'No'}</AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={routes.profile}>
              <BadgeCheck />
              My profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
