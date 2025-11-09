"use client";
import * as React from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/pagination";
import { formatPrice } from "@/lib/utils";
import { UserContext } from "@/lib/usercontent";
import { apiConfig } from "@/lib/api-config";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { ArrowRight, ArrowDownCircle, ArrowUpCircle, Copy, History, LoaderCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
interface TransactionData {
  id: string;
  transactionId: string;
  transactionType: string;
  amount: number;
  transactionFee: number;
  mode: string;
  status: string;
  formAddress: string;
  toAddress: string;
  createdAt: string;

  fxAccountNumber: number;
  fxTransactionId: string;
  type: string;
  transactionDate: string;
  remark: string;

}

export default function TransitionTable() {
  const [tableData, setTableData] = useState<TransactionData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [paginationMeta, setPaginationMeta] = useState({
    current_page: 1,
    limit: 20,
    total: 0,
    total_page: 1
  });
  const { userToken } = useContext(UserContext) || {};
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Filter state for transactionType
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const transactionTypeOptions = [
    { label: "All", value: "ALL" },
    { label: "Credit", value: "credit" },
    { label: "Debit", value: "debit" },
    // Add more types as needed
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!userToken) return;
      try {
        setIsLoading(true);
        const headers = {
          "Content-Type": "application/json",
          token: userToken,
        };
        const typeParam = selectedType !== "ALL" ? selectedType : "ALL";
        const res = await axios.get(
          `${apiConfig.assets.invetmentHistory}?transactionType=${typeParam}`,
          { headers }
        );
        
        if (res.data.result) {
          setTableData(res.data.result[0]?.data || []);
          //console.log(res.data.result[0]?.data);
          if(res.data.result[0]?.data){
          if (res.data.result[0]?.metadata[0]) {
            const metadata = res.data.result[0].metadata[0];
            const totalItems = metadata.total || 0;
            const itemsPerPage = metadata.limit || 20;
            const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);
            setPaginationMeta({
              current_page: metadata.current_page || 1,
              limit: itemsPerPage,
              total: totalItems,
              total_page: metadata.total_page || calculatedTotalPages
            });
          }
        }
        }
      } catch (err) {
        console.error("Error fetching transaction history:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userToken, paginationMeta.current_page, paginationMeta.limit, selectedType]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setPaginationMeta(prev => ({
      ...prev,
      current_page: page
    }));
  };

  const handleCopyAddress = (address: string, key: string) => {
    navigator.clipboard.writeText(address);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex flex-wrap gap-5 justify-between">
        <div>
        <CardTitle className="text-brand-3 text-lg lg:text-2xl font-bold">Investment History</CardTitle>
        <CardDescription className="text-slate-400 font-medium">Your recent investment in the plans</CardDescription>
        </div>
        <div className="mt-2 mb-4 text-right flex flex-nowrap items-center gap-2">
          <label htmlFor="transaction-type-select" className="font-medium text-sm">Transaction Type:</label>
            <Select
              value={selectedType}
              onValueChange={value => {
                setSelectedType(value);
                setCurrentPage(1);
                setPaginationMeta(prev => ({ ...prev, current_page: 1 }));
              }}
            >
              <SelectTrigger id="transaction-type-select" className="w-[150px] md:w-[200px] font-normal min-h-10 bg-gray-50 text-sm px-2 py-2">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {transactionTypeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        {tableData.map((item, index) => (
        <div key={`${item.id}-${index}`} className="p-4 rounded-xl transition-all duration-300 border shadow-sm bg-gray-50 bg-gradient-to-b from-gray-50 to-brand-5/5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                item.type === 'DEPOSIT'
                  ? 'bg-emerald-500/20'
                  : 'bg-red-500/20'
              }`}>
                {item.type === 'DEPOSIT' ? (
                  <ArrowDownCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ArrowUpCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
              <div>
                <p className="font-semibold capitalize">{item.type.toLowerCase()}</p>
                <p className="text-xs font-medium text-brand-5/60">{format(new Date(item.transactionDate), 'MMM dd, yyyy HH:mm')}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${
                item.type === 'DEPOSIT' ? 'text-brand-3' : 'text-destructive'
              }`}>
                {item.type === 'DEPOSIT' ? '+' : '-'} {formatPrice(item.amount || 0)}
              </p>
              {item.transactionFee !== 0 && (
              <p className="text-sm font-semibold text-brand-5/60">Fee: {formatPrice(item.transactionFee || 0)}</p>
              )}
              {/* <Badge variant={item.status === 'COMPLETED' ? 'default' : 'secondary'} className="text-xs">
                {item.status}
              </Badge> */}
            </div>
          </div>
          {item.formAddress || item.toAddress ? (
          <div className="flex flex-wrap gap-4 text-sm mt-3">
            {item.formAddress && (
            <div>
              <p className="text-brand-5/60">From</p>
              {item.formAddress.length >= 20 ? (
                <>
                <p className="text-brand-5 font-mono">{item.formAddress.slice(0, 10)}... 
                <TooltipProvider>
                  <Tooltip open={copiedKey === `from-${index}`}>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => handleCopyAddress(item.formAddress, `from-${index}`)}
                        variant="link"
                        size="icon"
                        className="size-7 shrink-0 cursor-pointer text-brand-5 bg-brand-4/20"
                      >
                        <Copy className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Copied!
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                </p>
                </>
              ) : (
              <p className="text-brand-5 font-mono">{item.formAddress}</p>
              )}
            </div>
            )}
            {item.formAddress && item.toAddress && (
            <div className="hidden md:block">
              <ArrowRight className="text-brand-5/60" />
            </div>
            )}
            {item.toAddress && (
            <div>
            <p className="text-brand-5/60">To</p>
            {item.toAddress.length >= 20 ? (
              <>
                <p className="text-brand-5 font-mono">{item.toAddress.slice(0, 10)}...
                <TooltipProvider>
                  <Tooltip open={copiedKey === `from-${index}`}>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => handleCopyAddress(item.toAddress, `from-${index}`)}
                        variant="link"
                        size="icon"
                        className="size-7 shrink-0 cursor-pointer text-brand-5 bg-brand-4/20"
                      >
                        <Copy className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Copied!
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                </p>
                </>
              ) : (
              <p className="text-brand-5 font-mono">{item.toAddress}</p>
              )}
            </div>
            )}
          </div>
          ): ("")}
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