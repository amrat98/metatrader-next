"use client";
import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Bot, Sparkle, User, UserCheck, Users } from "lucide-react";
import { useState } from "react";
import { cn, formatPrice } from "@/lib/utils";

import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useContext } from "react";
import { UserContext } from "@/lib/usercontent";
import type { TeamLegData } from "@/lib/usercontent";
import LevelView from "./levelview";
import LegView from "./legview";
import TreeView from "./treeview";

const cardStyle =
  "bg-card border-2  border-primary rounded-lg lg:rounded-2xl flex flex-row overflow-hidden ";


export default function Team() {
  const { profile, teamData, teamLegData, teamComposition, investMent, getTeamLegView } = useContext(UserContext) || {};

//console.log(teamComposition);
//console.log(profile, teamComposition);


  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempDate, setTempDate] = useState<DateRange | undefined>(undefined);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const handleApplyFilter = () => {
    if (tempDate?.from && tempDate?.to && getTeamLegView) {
      const fromDate = tempDate.from ? format(tempDate.from, 'yyyy-MM-dd') : undefined;
      const toDate = tempDate.to ? format(tempDate.to, 'yyyy-MM-dd') : undefined;
      getTeamLegView(fromDate, toDate).then(() => {
        setDate(tempDate);
        setCurrentPage(1);
      });
      return;
    }
    setDate(tempDate);
    setCurrentPage(1);
  };

  const mappedTeamBusiness = () => {
    const filteredData = (teamLegData as unknown as TeamLegData[]) || [];
    const totalProAmount = filteredData.reduce(
      (sum: number, team: TeamLegData) => sum + (team.ProAmount || 0),
      0
    );
    const totalExpressAmount = filteredData.reduce(
      (sum: number, team: TeamLegData) => sum + (team.ExpressAmount || 0),
      0
    );
    const totalTeamBusiness = filteredData.reduce(
      (sum: number, team: TeamLegData) => sum + (team.totalteamBusiness || 0),
      0
    );
    const totalDirectBusiness = filteredData.reduce(
      (sum: number, team: TeamLegData) => sum + (team.selfBusiness || 0),
      0
    );
    return {
      totalProAmount,
      totalExpressAmount,
      totalTeamBusiness,
      totalDirectBusiness,
    };
  };

  const data = {
    team: {
      total_team_title: "Total Team",
      total_team_value: teamComposition?.team || 0,
      active_team_title: "Active Team",
      active_team_value: profile?.userResult?.activeTeamSize || 0,
      total_direct_title: "Total Direct",
      total_direct_value: teamComposition?.directTeam || 0,
      active_direct_title: "Active Direct",
      active_direct_value: profile?.userResult?.activeDirectReferral || 0,
      strong_team_title: "Stronger Team BV",
      strong_team_value: teamComposition?.strongTeamBV || 0,
      weaker_team_title: "Weaker Team BV",
      weaker_team_value: teamComposition?.weakTeamBV || 0,
      ai_teamA_title: "AI Team A",
      ai_teamA_value: teamComposition?.teamA || 0,
      ai_teamB_title: "AI Team B",
      ai_teamB_value: teamComposition?.teamB || 0,
      pamm_teamA_title: "PAMM Team A",
      pamm_teamA_value: teamComposition?.bvTeamA || 0,
      pamm_teamB_title: "PAMM Team B",
      pamm_teamB_value: teamComposition?.bvTeamB || 0,
      investment_title: "My Investment",
      investment_value: investMent || 0,
      business_one_title: "Team Business (Express Pro)",
      business_one_value: mappedTeamBusiness().totalProAmount || 0,
      business_second_title: "Team Business (Gold + Diamond)",
      business_second_value: mappedTeamBusiness().totalExpressAmount || 0,
      total_business_title: "Total Team Business",
      total_business_value: mappedTeamBusiness().totalTeamBusiness || 0,
    },
    table: [
      { level: 1, total: 3, active: 2, inactive: 1, business: "4,900" },
      { level: 2, total: 4, active: 3, inactive: 1, business: "5,200" },
      { level: 3, total: 5, active: 3, inactive: 2, business: "6,000" },
    ],
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-5 p-4">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold mb-2">
            <span className="meta-text">My Team</span>
          </h1>
          <p className="text-muted-foreground">View and manage your referral network</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5"> 
          <Card className="glass-effect hover:scale-102 transition-all duration-300 group flex-1 gap-2">
            <CardHeader className="gap-0">
              <div className="flex items-center justify-between"> 
                <CardTitle className="text-base text-muted-foreground">{data.team.total_team_title}</CardTitle>
                <Users className="size-5 text-brand-2" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-extra-4">
              {data.team.total_team_value}
              </p>
            </CardContent>
          </Card>
          <Card className="glass-effect hover:scale-102 transition-all duration-300 group flex-1 gap-2">
            <CardHeader className="gap-0">
              <div className="flex items-center justify-between"> 
                <CardTitle className="text-base text-muted-foreground">{data.team.active_team_title}</CardTitle>
                <UserCheck className="size-5 text-extra-3" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-extra-3">
              {data.team.active_team_value}
              </p>
            </CardContent>
          </Card>
          <Card className="glass-effect hover:scale-102 transition-all duration-300 group flex-1 gap-2">
            <CardHeader className="gap-0">
              <div className="flex items-center justify-between"> 
                <CardTitle className="text-base text-muted-foreground">{data.team.total_direct_title}</CardTitle>
                <Users className="size-5 text-brand-2" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-extra-1">
              {data.team.total_direct_value}
              </p>
            </CardContent>
          </Card>
          <Card className="glass-effect hover:scale-102 transition-all duration-300 group flex-1 gap-2">
            <CardHeader className="gap-0">
              <div className="flex items-center justify-between"> 
                <CardTitle className="text-base text-muted-foreground">{data.team.active_direct_title}</CardTitle>
                <UserCheck className="size-5 text-extra-3" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold bg-gradient-to-r from-extra-3 to-extra-4 bg-clip-text text-transparent">
              {data.team.active_direct_value}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="glass-effect hover:scale-102 transition-all duration-300 group flex-1 gap-2">
            <CardHeader className="gap-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-muted-foreground">AI Team</CardTitle>
                <Bot className="size-5 text-brand-2" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="border p-3 rounded-lg border-b-4 border-brand-2/70 meta-shine flex-1">
                  <p className="text-base font-semibold text-white mb-2">Team A</p>
                  <p className="text-2xl font-bold text-brand-1 flex items-center gap-2">
                  <User className="size-6 text-brand-4" /> {data.team.ai_teamA_value}
                  </p>
                </div>
                <div className="border p-3 rounded-lg border-b-4 border-brand-2/70 meta-shine flex-1">
                  <p className="text-base font-semibold text-white0 mb-2">Team B</p>
                  <p className="text-2xl font-bold text-brand-1 flex items-center gap-2">
                  <User className="size-6 text-brand-4" /> {data.team.ai_teamB_value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-effect hover:scale-102 transition-all duration-300 group flex-1 gap-2">
            <CardHeader className="gap-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-muted-foreground">PAMM Team</CardTitle>
                <Users className="size-5 text-brand-2" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="border p-3 rounded-lg border-b-4 border-brand-2/70 meta-shine flex-1">
                  <p className="text-base font-semibold text-white mb-2">Team A</p>
                  <p className="text-2xl font-bold text-extra-3 flex items-center gap-2">
                   {formatPrice(data.team.pamm_teamA_value)}
                  </p>
                </div>
                <div className="border p-3 rounded-lg border-b-4 border-brand-2/70 meta-shine flex-1">
                  <p className="text-base font-semibold text-white mb-2">Team B</p>
                  <p className="text-2xl font-bold text-extra-3 flex items-center gap-2">
                  {formatPrice(data.team.pamm_teamB_value)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 pb-5">
          <TreeView />
        </div>
      </div>
    </>
  );
}
