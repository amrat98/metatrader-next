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
import { ArrowLeft } from "lucide-react";
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
        <div className={`${cardStyle}`}>
          <div className="flex flex-wrap flex-1 text-nowrap">
            <div className="p-3 lg:p-5 self-center text-center flex-1">
              <h2 className="text-sm md:text-base lg:text-lg ">{data.team.total_team_title}</h2>
              <Separator orientation="horizontal" className="my-2" />
              <div className="text-lg lg:text-2xl font-bold truncate">{data.team.total_team_value}</div>
            </div>
            <div className="p-3 lg:p-5 self-center text-center flex-1">
              <h2 className="text-sm md:text-base lg:text-lg ">{data.team.active_team_title}</h2>
              <Separator orientation="horizontal" className="my-2" />
              <div className="text-lg lg:text-2xl font-bold truncate">{data.team.active_team_value}</div>
            </div>
            <div className="p-3 lg:p-5 self-center text-center flex-1">
              <h2 className="text-sm md:text-base lg:text-lg ">{data.team.total_direct_title}</h2>
              <Separator orientation="horizontal" className="my-2" />
              <div className="text-lg lg:text-2xl font-bold truncate">{data.team.total_direct_value}</div>
            </div>
            <div className="p-3 lg:p-5 self-center text-center flex-1">
              <h2 className="text-sm md:text-base lg:text-lg ">
                {data.team.active_direct_title}
              </h2>
              <Separator orientation="horizontal" className="my-2" />
              <div className="text-lg lg:text-2xl font-bold truncate">{data.team.active_direct_value}</div>
            </div>
            {/* <div className="p-3 lg:p-5 self-center text-center flex-1">
              <h2 className="text-sm md:text-base lg:text-lg ">
                {data.team.strong_team_title}
              </h2>
              <Separator orientation="horizontal" className="my-2" />
              <div className="text-lg lg:text-2xl font-bold truncate">
              {formatPrice(data.team.strong_team_value)}
              </div>
            </div>
            <div className="p-3 lg:p-5 self-center text-center flex-1">
              <h2 className="text-sm md:text-base lg:text-lg ">
                {data.team.weaker_team_title}
              </h2>
              <Separator orientation="horizontal" className="my-2" />
              <div className="text-lg lg:text-2xl font-bold truncate">
              {formatPrice(data.team.weaker_team_value)}
              </div>
            </div> */}
          </div>
        </div>
        <div className={`${cardStyle}`}>
          <div className="flex flex-wrap flex-1 text-nowrap">
            <div className="p-3 lg:p-5 self-center text-center flex-1">
              <h2 className="text-sm md:text-base lg:text-lg ">
                {data.team.ai_teamA_title}
              </h2>
              <Separator orientation="horizontal" className="my-2" />
              <div className="text-lg lg:text-2xl font-bold truncate">
                {data.team.ai_teamA_value}
              </div>
            </div>
            <div className="p-3 lg:p-5 self-center text-center flex-1">
              <h2 className="text-sm md:text-base lg:text-lg ">
                {data.team.ai_teamB_title}
              </h2>
              <Separator orientation="horizontal" className="my-2" />
              <div className="text-lg lg:text-2xl font-bold truncate">
                {data.team.ai_teamB_value}
              </div>
            </div>
            <div className="p-3 lg:p-5 self-center text-center flex-1">
              <h2 className="text-sm md:text-base lg:text-lg ">
                {data.team.pamm_teamA_title}
              </h2>
              <Separator orientation="horizontal" className="my-2" />
              <div className="text-lg lg:text-2xl font-bold truncate">
                {formatPrice(data.team.pamm_teamA_value)}
              </div>
            </div>
            <div className="p-3 lg:p-5 self-center text-center flex-1">
              <h2 className="text-sm md:text-base lg:text-lg ">
                {data.team.pamm_teamB_title}
              </h2>
              <Separator orientation="horizontal" className="my-2 " />
              <div className="text-lg lg:text-2xl font-bold truncate">
                {formatPrice(data.team.pamm_teamB_value)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 pb-5">
          <Tabs defaultValue="tree" className="">
            <TabsList className="bg-transparent w-full border-b-2 border-primary rounded-none h-12 p-0 gap-2.5 justify-start mb-2  overflow-auto">
              <TabsTrigger value="tree" className="border-primary text-foreground! rounded-b-none border-b-0 data-[state=active]:bg-primary! data-[state=active]:text-background! text-sm lg:text-base font-semibold grow-0 lg:min-w-52 px-4 cursor-pointer">
                Tree View
              </TabsTrigger>
              <TabsTrigger value="level" className="border-primary text-foreground! rounded-b-none border-b-0 data-[state=active]:bg-primary! data-[state=active]:text-background! text-sm lg:text-base font-semibold grow-0 lg:min-w-52 px-4 cursor-pointer">
                Level View
              </TabsTrigger>
              {/* <TabsTrigger value="leg" className="border-primary text-foreground! rounded-b-none border-b-0 data-[state=active]:bg-primary! data-[state=active]:text-background! text-sm lg:text-base font-semibold grow-0 lg:min-w-52 px-4 cursor-pointer">
                Leg View
              </TabsTrigger> */}
            </TabsList>
            <TabsContent value="tree" className="bg-card">
              <TreeView />
            </TabsContent>
            <TabsContent value="level" className="">
              <LevelView />
            </TabsContent>
            {/* <TabsContent value="leg">
              <div className="mt-2 mb-4 flex-1 text-right flex flex-wrap items-center justify-end gap-5">
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-[300px] justify-start text-left font-normal min-h-12 flex-1 min-w-[300px] md:flex-none text-sm lg:text-base",
                        !tempDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tempDate?.from ? (
                        tempDate.to ? (
                          <>
                            {format(tempDate.from, "dd-MM-yy")} <span className="font-semibold text-primary">TO</span> {format(tempDate.to, "dd-MM-yy")}
                          </>
                        ) : (
                          format(tempDate.from, "dd-MM-yy")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      selected={tempDate}
                      onSelect={(selectedDate) => {
                        setTempDate(selectedDate);
                        if (selectedDate?.from && selectedDate?.to) {
                          setIsCalendarOpen(false);
                        }
                      }}
                      numberOfMonths={1}
                      disabled={{ after: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
                <Button
                  variant="primary"
                  onClick={handleApplyFilter}
                  className="min-h-12 font-normal text-sm lg:text-base"
                >
                  Apply Filter
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setTempDate(undefined);
                    setDate(undefined);
                    setCurrentPage(1);
                    if (getTeamLegView) {
                      getTeamLegView(); // fetch all data (no filter)
                    }
                  }}
                  className="min-h-12 font-normal text-sm lg:text-base"
                >
                  Clear
                </Button>
              </div>
              <LegView dateRange={date} />
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
    </>
  );
}
