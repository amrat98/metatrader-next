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
import { CalendarIcon, BicepsFlexed } from "lucide-react";
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
  nickName: string;
  firstName: string;
  lastName: string;
  status: boolean;
  activationDate: string;
  selfBusiness: number;
  ProAmount: number;
  ExpressAmount: number;
  totalteamBusiness: number;
}

interface LegViewProps {
  dateRange?: DateRange;
}

export default function LegView({ dateRange }: LegViewProps) {
  const [showLegDetails] = useState(false);
  const [tableData, setTableData] = useState<TeamListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { userToken } = useContext(UserContext) || {};

  const itemsPerPage = 20;
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = tableData.slice(startIndex, endIndex);

  // Calculate the highest sum
  const getHighestSum = () => {
    if (tableData.length === 0) return 0;
    return Math.max(...tableData.map(item => item.ProAmount + item.ExpressAmount + item.totalteamBusiness));
  };

  const highestSum = getHighestSum();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleApplyFilter = () => {
    setCurrentPage(1);
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
        const res = await axios.get(apiConfig.team.teamLegView, {
          headers,
          params: {
            fromDate: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : "",
            toDate: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : "",
          }
        });
        if (res.data.result) {
          setTableData(res.data.result);
        }
      } catch (err) {
        console.error("Error fetching team list:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamList();
  }, [userToken, dateRange]);

  return (
    <>
        <div className="overflow-auto w-full border-2 border-primary bg-card">
          <Table className="lg:text-base">
            <TableCaption className="hidden">
              A list of your Leg.
            </TableCaption>
            <TableHeader className="bg-slate-900">
              <TableRow>
                <TableHead className="text-center">User Name</TableHead>
                <TableHead className="text-center">Member Name</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Activation Date</TableHead>
                <TableHead className="text-center">Self Business</TableHead>
                <TableHead className="text-center">Team Business (Express Pro)</TableHead>
                <TableHead className="text-center">Team Business (Gold + Diamond)</TableHead>
                <TableHead className="text-center">Team Business</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : currentItems.length > 0 ? (
                currentItems.map((item, idx) => {
                  const itemSum = item.ProAmount + item.ExpressAmount + item.totalteamBusiness;
                  const isHighest = itemSum === highestSum && highestSum > 0;
                  
                  return (
                    <TableRow key={idx}>
                      <TableCell className="text-center">
                        {isHighest && <BicepsFlexed className="inline mr-2 size-6 text-yellow-500" />}
                        {item.nickName}
                      </TableCell>
                      <TableCell className="text-center">{item.firstName} {item.lastName}</TableCell>
                      <TableCell className="text-center">
                        <span className={`py-1 px-3 rounded-sm text-sm min-w-20 inline-block font-semibold ${
                          item.status === true ? 'bg-green-600' : 'bg-red-500'
                        }`}>
                          {item.status === true ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">{item.activationDate ? format(new Date(item.activationDate), 'dd-MM-yy  |  HH:mm a') : '-'}</TableCell>
                      <TableCell className="text-center">{formatPrice(item.selfBusiness)}</TableCell>
                      <TableCell className="text-center">{formatPrice(item.ProAmount)}</TableCell>
                      <TableCell className="text-center">{formatPrice(item.ExpressAmount)}</TableCell>
                      <TableCell className="text-center">{formatPrice(item.totalteamBusiness)}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-5"
        />
    </>
  );
}