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
import { CalendarIcon } from "lucide-react";
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
      <div className={showLegDetails ? "hidden" : "block"}>
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
                      {format(tempDate.from, "dd-MM-yy")}{" "}<span className="font-semibold text-primary">TO</span>{" "}{format(tempDate.to, "dd-MM-yy")}
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
            <SelectTrigger className="min-w-full md:min-w-0 md:w-[200px] bg-white font-normal min-h-12 text-sm lg:text-base flex-1 md:flex-none">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              {data.filter.map((item,idx)=>(
                <SelectItem key={idx} value={item.value}>{item.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                setTempFilter("ALL");
                setDate(undefined);
                setSelectedFilter("ALL");
                setCurrentPage(1);
              }}
              className="min-h-12 font-normal text-sm lg:text-base"
            >
              Clear
            </Button>
          
        </div>
        <div className="overflow-auto w-full border-2 border-primary bg-card">
          <Table className="lg:text-base">
            <TableCaption className="hidden">
              A list of your Leg.
            </TableCaption>
            <TableHeader className="bg-brand-2">
              <TableRow>
                <TableHead className="text-center text-black">Amount</TableHead>
                <TableHead className="text-center text-black">Income Type</TableHead>
                <TableHead className="text-center text-black">From</TableHead>
                <TableHead className="text-center text-black">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) :tableData.length > 0 ? (
                tableData.map((item: TeamListItem, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell className="text-center">{formatPrice(item.amount)}</TableCell>
                    <TableCell className="text-center">
                      {item?.rewardType === "ROI" && "PAMM Profit"}
                      {item?.rewardType === "Referral" && "Introducer Bonus"}
                      {item?.rewardType === "TEAM_ROI" && "Profit Sharing"}
                      {item?.rewardType === "MATCHING_BONUS" && "IB Ranking Bonus"}
                      {item?.rewardType === "MATCHING_REWARD_BONUS" && "IB Matching"}
                      {item?.rewardType === "MONTHLY_ALLOWANCE" && "Monthly Allowance"}
                      {item?.rewardType === "WEEKLY_ALLOWANCE" && "Weekly Allowance"}
                      {item?.rewardType === "BILLIONAIR_CLUB" && "Billionaire Club"}
                    </TableCell>
                    <TableCell className="text-center">
                      {/* {item.from? formatPrice(item.from) : ""} 
                      
                      ({item.receipt?.remark || "N/A" }) */}

                      {item?.senderUserData?.nickName ? `${item?.senderUserData?.nickName}` : item?.from ? `${item?.from}` : ""}
                      {item?.amountType === "ROI" && item?.receipt?.remark && (
                        <span> ({item?.receipt?.remark})</span>
                      )}
                      </TableCell>
                    <TableCell className="text-center">{item.createdAt ? format(new Date(item.createdAt), 'dd-MM-yy  |  HH:mm a') : '-'}</TableCell>
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
        {paginationMeta.total_page > 1 && (
          <Pagination
          currentPage={currentPage}
          totalPages={paginationMeta.total_page}
          onPageChange={handlePageChange}
          className="mt-4"
        />
        )}
      </div>
    </>
  );
}