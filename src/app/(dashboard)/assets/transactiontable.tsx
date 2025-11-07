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
import { Copy } from "lucide-react";
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
    { label: "Deposit", value: "DEPOSIT" },
    { label: "Withdraw", value: "WITHDRAW" },
    { label: "Transfer", value: "TRANSFER" },
    { label: "Plan Purchase", value: "PLAN PURCHASE" },
    { label: "Credit", value: "CREDIT" },
    { label: "Debit", value: "DEBIT" },
    { label: "Redeem", value: "REDEEM" },
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
        const typeParam = selectedType !== "ALL" ? selectedType : "";
        const res = await axios.get(
          `${apiConfig.assets.purchaseHistory}?transacionType=${typeParam}&page=${paginationMeta.current_page}&limit=${paginationMeta.limit}`,
          { headers }
        );
        if (res.data.result) {
          setTableData(res.data.result?.data || []);
          if(res.data.result?.data){
          if (res.data.result.metaData[0]) {
            const metadata = res.data.result.metaData[0];
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
    <div className="mt-2 mb-4 flex-1 text-right flex flex-nowrap items-center justify-end gap-5">
      <label htmlFor="transaction-type-select" className="mr-2 font-medium text-sm lg:text-base">Transaction Type:</label>
        <Select
          value={selectedType}
          onValueChange={value => {
            setSelectedType(value);
            setCurrentPage(1);
            setPaginationMeta(prev => ({ ...prev, current_page: 1 }));
          }}
        >
          <SelectTrigger id="transaction-type-select" className="w-[200px] font-normal min-h-12 text-sm lg:text-base bg-white  border rounded px-2 py-2">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            {transactionTypeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
    </div>
      <div className="overflow-auto w-full border-2 border-primary bg-card">
        <Table className="lg:text-base">
          <TableCaption className="hidden">
            A list of your transactions.
          </TableCaption>
          <TableHeader className="bg-brand-2">
            <TableRow className="border-brand-1/50">
              <TableHead className="text-center text-black">Transaction ID</TableHead>
              <TableHead className="text-center text-black">Transaction Type</TableHead>
              <TableHead className="text-center text-black">Amount</TableHead>
              <TableHead className="text-center text-black">Transaction Fees</TableHead>
              <TableHead className="text-center text-black">Mode</TableHead>
              <TableHead className="text-center text-black">Status</TableHead>
              <TableHead className="text-center text-black">From Address</TableHead>
              <TableHead className="text-center text-black">To Address</TableHead>
              <TableHead className="text-center text-black">Date & Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : tableData.length > 0 ? (
              tableData.map((item, index) => (
                <TableRow key={`${item.id}-${index}`}>
                  <TableCell className="text-center">{item.transactionId || "-"}</TableCell>
                  <TableCell className="text-center">{item.transactionType || "-"}</TableCell>
                  <TableCell className="text-center">{formatPrice(item.amount || 0)}</TableCell>
                  <TableCell className="text-center">{formatPrice(item.transactionFee || 0)}</TableCell>
                  <TableCell className="text-center">{item.mode || "WALLET"}</TableCell>
                  <TableCell className="text-center">{item.status || "-"}</TableCell>
                  <TableCell className="text-center relative">
                    {item.formAddress ? (
                      <div className="flex items-center justify-center gap-2">
                        <span>{/\d/.test(item.formAddress) ? `${item.formAddress.slice(0, 10)}...` : item.formAddress}</span>
                        {/\d/.test(item.formAddress) ? (
                        <TooltipProvider>
                          <Tooltip open={copiedKey === `from-${index}`}>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={() => handleCopyAddress(item.formAddress, `from-${index}`)}
                                variant="link"
                                size="icon"
                                className="size-6 shrink-0 cursor-pointer"
                              >
                                <Copy className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Copied!
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        ) : ""}
                      </div>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-center relative">
                    {item.toAddress ? (
                      <div className="flex items-center justify-center gap-2">
                        <span>{/\d/.test(item.toAddress) ? `${item.toAddress.slice(0, 10)}...` : item.toAddress}</span>
                        {/\d/.test(item.toAddress) ? (
                        <TooltipProvider>
                          <Tooltip open={copiedKey === `to-${index}`}>
                            <TooltipTrigger asChild>
                            <Button
                                onClick={() => handleCopyAddress(item.toAddress, `to-${index}`)}
                                variant="link"
                                size="icon"
                                className="size-6 shrink-0 cursor-pointer"
                              >
                                <Copy className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Copied!
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        ) : ""}
                      </div>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-center">{item.createdAt ? format(new Date(item.createdAt), 'dd-MM-yy  |  HH:mm a') : '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                No transaction details found.
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
    </>
  );
}