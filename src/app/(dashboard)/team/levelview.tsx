"use client";
import * as React from "react";
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
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { cn, formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Pagination } from "@/components/pagination";
import axios from "axios";
import { apiConfig } from "@/lib/api-config";
import { UserContext } from "@/lib/usercontent";

interface TeamListItem {
  level: number;
  totalActiveTeam: number;
  totalBusiness: number;
  totalInactiveTeam: number;
  totalTeam: string;
}

interface TeamListViewItem {
  username: string;
  fullName: string;
  status: boolean;
  business: number;
}

export default function LevelView() {
  const [showLevelDetails, setShowLevelDetails] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [tableData, setTableData] = useState<TeamListItem[]>([]);
  const [levelViewData, setLevelViewData] = useState<TeamListViewItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [levelViewCurrentPage, setLevelViewCurrentPage] = useState(1);
  const { userToken } = useContext(UserContext) || {};

  const itemsPerPage = 20;
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = tableData.slice(startIndex, endIndex);

  const levelViewTotalPages = Math.ceil(levelViewData.length / itemsPerPage);
  const levelViewStartIndex = (levelViewCurrentPage - 1) * itemsPerPage;
  const levelViewEndIndex = levelViewStartIndex + itemsPerPage;
  const currentLevelViewItems = levelViewData.slice(levelViewStartIndex, levelViewEndIndex);

  useEffect(() => {
    const fetchTeamList = async () => {
      if (!userToken) return;
      try {
        setIsLoading(true);
        const headers = {
          "Content-Type": "application/json",
          token: userToken,
        };
        const res = await axios.get(apiConfig.team.teamListTab, { headers });
        if (res.data.result) {
          setTableData(res.data.result[0].data);
        }
      } catch (err) {
        console.error("Error fetching team list:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamList();
  }, [userToken]);

  const fetchTeamListView = async (level: number) => {
    if (!userToken) return;
    try {
      setIsDataLoading(true);
      const headers = {
        "Content-Type": "application/json",
        token: userToken,
      };
      const res = await axios.get(`${apiConfig.team.teamListView}?level=${level}&limit=${itemsPerPage}`, { headers });
     // console.log(res.data.result[0].data);
      if (res.data.result) {
        setLevelViewData(res.data.result[0].data);
      }
    } catch (err) {
      console.error("Error fetching team list view:", err);
    } finally {
      setIsDataLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLevelClick = async (level: number) => {
    setSelectedLevel(level);
    await fetchTeamListView(level);
    setShowLevelDetails(true);
  };

  const handleLevelViewPageChange = (page: number) => {
    setLevelViewCurrentPage(page);
  };

  return (
    <>
      <div className={showLevelDetails ? "hidden" : "block"}>
        <div className="mt-2 mb-4 text-right hidden">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal min-h-12",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                disabled={{ after: new Date() }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="overflow-auto w-full border-2 border-primary bg-card">
          <Table className="lg:text-base">
            <TableCaption className="hidden">
              A list of your Level.
            </TableCaption>
            <TableHeader className="bg-brand-2">
              <TableRow>
                <TableHead className="text-center text-black">Level</TableHead>
                <TableHead className="text-center text-black">Total</TableHead>
                <TableHead className="text-center text-black">Active</TableHead>
                <TableHead className="text-center text-black">Inactive</TableHead>
                <TableHead className="text-center text-black">Team Business</TableHead>
                <TableHead className="text-center text-black">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : currentItems.length > 0 ? (
                currentItems.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-center">{item.level}</TableCell>
                    <TableCell className="text-center">{item.totalTeam}</TableCell>
                    <TableCell className="text-center">{item.totalActiveTeam}</TableCell>
                    <TableCell className="text-center">{item.totalInactiveTeam}</TableCell>
                    <TableCell className="text-center">{formatPrice(item.totalBusiness)}</TableCell>
                    <TableCell className="text-center">
                      <Link
                        href="#"
                        className={buttonVariants({
                          variant: "link",
                          className: "text-sm",
                        })}
                        onClick={() => handleLevelClick(item.level)}
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
           <Pagination
           currentPage={currentPage}
           totalPages={totalPages}
           onPageChange={handlePageChange}
           className="mt-4"
         />
        )}
      </div>
      <div className={showLevelDetails ? "block" : "hidden"}>
      <div className="border-b-2 border-primary mb-3">
          <Button
            variant="primary"
            className="level_back font-semibold rounded-b-none text-sm lg:text-base px-4 py-1 min-h-12 hover:bg-primary hover:text-background cursor-pointer"
            onClick={() => {
              setShowLevelDetails(false);
              setSelectedLevel(null);
            }}
          >
            <ArrowLeft className="size-4 lg:size-5 mr-2" />
            Go To Level View | Level {selectedLevel}
          </Button>
        </div>
        <div className="overflow-auto w-full border-2 border-primary bg-card">
          <Table className="lg:text-base">
            <TableCaption className="hidden">
              A list of your Level.
            </TableCaption>
            <TableHeader className="bg-slate-900">
              <TableRow>
                <TableHead className="text-center">Username</TableHead>
                <TableHead className="text-center">Full Name</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Team Business</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {isDataLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) :currentLevelViewItems.length > 0 ? (
                currentLevelViewItems.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-center">{item.username}</TableCell>
                    <TableCell className="text-center">{item.fullName}</TableCell>
                    <TableCell className="text-center">
                      <span className={`py-1 px-3 rounded-sm text-sm min-w-20 inline-block font-semibold ${
                        item.status === true ? 'bg-green-600' : 'bg-red-500'
                      }`}>
                        {item.status === true ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">{formatPrice(item.business)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {levelViewTotalPages > 1 && (
          <Pagination
          currentPage={levelViewCurrentPage}
          totalPages={levelViewTotalPages}
          onPageChange={handleLevelViewPageChange}
          className="mt-4"
        />
        )}
      </div>
    </>
  );
}