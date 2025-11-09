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
import { Button } from "@/components/ui/button";
import { CalendarIcon, ArrowRight, ArrowDownCircle, ArrowUpCircle, Copy, History, LoaderCircle, Users, Sparkle, ChartSpline, GitFork, CalendarArrowUp, Wallet, Gift } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect, useContext } from "react";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

interface TeamListItem {
  amount: number;
  rewardType: string;
  from: string;
  createdAt: string;
  receipt?: { remark?: string };
  senderUserData?: { nickName?: string };
  amountType?: string;
}

export default function AllIncomeView() {
  const [showLegDetails] = useState(false);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [tableData, setTableData] = useState<TeamListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [paginationMeta, setPaginationMeta] = useState({
    current_page: 1,
    limit: 20,
    total: 0,
    total_page: 1
  });
  const { userToken } = useContext(UserContext) || {};
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempDate, setTempDate] = useState<DateRange | undefined>(undefined);
  const [tempFilter, setTempFilter] = useState("ALL");

  const itemsPerPage = 20;

  const data = {
    filter: [
      {
        label: "All",
        value: "ALL",
      },
      {
        label: "PAMM Profit",
        value: "ROI",
      },
      {
        label: "Introducer Bonus",
        value: "Referral",
      },
      {
        label: "Profit Sharing",
        value: "TEAM_ROI",
      },
      {
        label: "IB Ranking Bonus",
        value: "MATCHING_BONUS",
      },
      {
        label: "IB Matching",
        value: "MATCHING_REWARD_BONUS",
      },
      {
        label: "Monthly Allowance",
        value: "MONTHLY_ALLOWANCE",
      },
      {
        label: "Weekly Allowance",
        value: "WEEKLY_ALLOWANCE",
      },
      {
        label: "Billionaire Club",
        value: "BILLIONAIR_CLUB"
      }
    ],
  };

  useEffect(() => {
    const fetchTeamList = async () => {
      if (!userToken) return;
      try {
        setIsLoading(true);
        const headers = {
          "Content-Type": "application/json",
          token: userToken,
        };
        const body = {
          limit: itemsPerPage,
          page: currentPage,
          selectActivationType: selectedFilter,
          fromDate: date?.from ? format(date.from, 'yyyy-MM-dd') : "",
          toDate: date?.to ? format(date.to, 'yyyy-MM-dd') : "",
        };
        const res = await axios.post(apiConfig.dashboard.getActivationGain, body, { headers });
        console.log(res.data);
        if (res.data.result) {
          setTableData(res.data.result[0]?.data);
          if (res.data.result[0]?.metadata?.[0]) {
            setPaginationMeta(res.data.result[0].metadata[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching team list:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamList();
  }, [userToken, date, selectedFilter, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleApplyFilter = () => {
    setDate(tempDate);
    setSelectedFilter(tempFilter);
    setCurrentPage(1);
  };

  return (
    <>
      <Card>
      <CardHeader>
      <div className="flex flex-wrap gap-5 justify-between">
        <div>
        <CardTitle className="text-brand-3 text-lg lg:text-2xl font-bold">Earnings History</CardTitle>
        <CardDescription className="text-slate-400 font-medium">Referral bonuses and rewards</CardDescription>
        </div>
        <div className="mt-2 mb-4 text-right flex flex-wrap items-center gap-2">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal min-h-10 flex-1 min-w-[300px] md:flex-none text-sm bg-gray-50",
                    !tempDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {tempDate?.from ? (
                    tempDate.to ? (
                      <>
                        {format(tempDate.from, "dd-MM-yy")}{" "}<span className="font-semibold">TO</span>{" "}{format(tempDate.to, "dd-MM-yy")}
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
          <Select value={tempFilter} onValueChange={setTempFilter}>
            <SelectTrigger className="min-w-full md:min-w-0 md:w-[200px] font-normal min-h-10 text-sm flex-1 md:flex-none">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              {data.filter.map((item,idx)=>(
                <SelectItem key={idx} value={item.value}>{item.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="secondary"
            onClick={handleApplyFilter}
            className="min-h-10 text-sm"
          >
            Apply Filter
          </Button>
          <Button
              variant="outline"
              onClick={() => {
                setTempDate(undefined);
                setTempFilter("ALL");
                setDate(undefined);
                setSelectedFilter("ALL");
                setCurrentPage(1);
              }}
              className="min-h-10 text-sm"
            >
              Clear
            </Button>
        </div>
      </div>
      </CardHeader>
      <CardContent className="space-y-4 relative">
      {isLoading ? (
        <>
        {Array.from({ length: 4 }).map((_,i) => (
          <div key={i} className="p-4 rounded-xl transition-all duration-300 border ">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[50px] ml-auto" />
              </div>
            </div>
          </div>
        ))}
      </>
      ): (
        <>
      {tableData.length === 0 ? (
        <div className="text-center py-12">
        <History className="w-16 h-16 mx-auto mb-4 text-slate-600" />
        <p className="text-slate-400">No transactions yet</p>
        </div>
      )
      :
      (
        <>
        {tableData.map((item: TeamListItem, index: number) => (
        <div key={index} className="p-4 rounded-xl transition-all duration-300 border shadow-sm bg-gray-50 bg-gradient-to-b from-gray-50 to-brand-5/5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 min-w-10 rounded-full flex items-center justify-center bg-gradient-to-br 
              ${item?.rewardType === "ROI" && 'from-brand-1 to-brand-2'}
              ${item?.rewardType === "Referral" && 'from-brand-4 to-brand-5'}
              ${item?.rewardType === "TEAM_ROI" && 'from-brand-1 to-brand-2'}
              ${item?.rewardType === "MATCHING_BONUS" && 'from-brand-2 to-brand-3'}
              ${item?.rewardType === "MATCHING_REWARD_BONUS" && 'from-brand-4 to-brand-5'}
              ${item?.rewardType === "MONTHLY_ALLOWANCE" && 'from-brand-1 to-brand-5'}
              ${item?.rewardType === "WEEKLY_ALLOWANCE" && 'from-brand-1 to-brand-5'}
              ${item?.rewardType === "BILLIONAIR_CLUB" && 'from-brand-2 to-brand-3'}
              `}>
                {item?.rewardType === "ROI" && (<Users className="size-5 text-white" />)}
                {item?.rewardType === "Referral" && (<Gift className="size-5 text-white" />)}
                {item?.rewardType === "TEAM_ROI" && (<ChartSpline className="size-5 text-white" />)}
                {item?.rewardType === "MATCHING_BONUS" && (<Sparkle className="size-5 text-white" />)}
                {item?.rewardType === "MATCHING_REWARD_BONUS" && (<GitFork className="size-5 text-white" />)}
                {item?.rewardType === "MONTHLY_ALLOWANCE" && (<CalendarArrowUp className="size-5 text-white" />)}
                {item?.rewardType === "WEEKLY_ALLOWANCE" && (<CalendarArrowUp className="size-5 text-white" />)}
                {item?.rewardType === "BILLIONAIR_CLUB" && (<Wallet className="size-5 text-white" />)}
                {/* {item.transactionType === 'DEPOSIT' ? (
                  <ArrowDownCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ArrowUpCircle className="w-5 h-5 text-red-400" />
                )} */}
              </div>
              <div>
                <p className="text-sm md:text-base font-semibold capitalize">
                {item?.rewardType === "ROI" && "PAMM Profit"}
                {item?.rewardType === "Referral" && "Introducer Bonus"}
                {item?.rewardType === "TEAM_ROI" && "Profit Sharing"}
                {item?.rewardType === "MATCHING_BONUS" && "IB Ranking Bonus"}
                {item?.rewardType === "MATCHING_REWARD_BONUS" && "IB Matching"}
                {item?.rewardType === "MONTHLY_ALLOWANCE" && "Monthly Allowance"}
                {item?.rewardType === "WEEKLY_ALLOWANCE" && "Weekly Allowance"}
                {item?.rewardType === "BILLIONAIR_CLUB" && "Billionaire Club"}
                </p>
                {item.receipt?.remark && (<p className="hidden md:block text-xs font-medium text-brand-5/80 break-all mt-1">{item.receipt?.remark}</p>)}
                <p className="text-xs font-medium text-brand-5/60 mt-1">{format(new Date(item.createdAt), 'MMM dd, yyyy HH:mm')}</p>
              </div>
            </div>
            <div className="text-right whitespace-nowrap">
              <p className="text-base md:text-lg font-bold text-brand-3">{formatPrice(item.amount || 0)}</p>
              {/* <p className={`text-lg font-bold ${
                item.transactionType === 'DEPOSIT' ? 'text-brand-3' : 'text-destructive'
              }`}>
                {item.transactionType === 'DEPOSIT' ? '+' : '-'} {formatPrice(item.amount || 0)}
              </p>
              {item.transactionFee !== 0 && (
              <p className="text-sm font-semibold text-brand-5/60">Fee: {formatPrice(item.transactionFee || 0)}</p>
              )} */}
            </div>
          </div>
        </div>
      ))}

      {paginationMeta.total_page > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={paginationMeta.total_page}
          onPageChange={handlePageChange}
          className="mt-4"
        />
      )}
      </>
      )}
      </>
      )}
      </CardContent>
      </Card>
    </>
  );
}