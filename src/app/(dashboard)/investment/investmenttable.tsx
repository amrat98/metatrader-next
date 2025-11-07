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
          if (res.data.result[0]?.metaData[0]) {
            const metadata = res.data.result[0].metaData[0];
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
          <SelectTrigger id="transaction-type-select" className="w-[200px] bg-white font-normal min-h-12 text-sm lg:text-base  border rounded px-2 py-2">
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
            <TableRow>
              <TableHead className="text-center text-black">Transaction ID</TableHead>
              <TableHead className="text-center text-black">Transaction Type</TableHead>
              <TableHead className="text-center text-black">Amount</TableHead>
              <TableHead className="text-center text-black">Transaction Date</TableHead>
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
                  <TableCell className="text-center">{item.fxTransactionId || "-"}</TableCell>
                  <TableCell className="text-center">{item.type || "-"}</TableCell>
                  <TableCell className="text-center">{formatPrice(item.amount || 0)}</TableCell>
                  <TableCell className="text-center">{item.transactionDate ? format(new Date(item.transactionDate), 'dd-MM-yy  |  HH:mm a') : '-'}</TableCell>
                  <TableCell className="text-center">{item.createdAt ? format(new Date(item.createdAt), 'dd-MM-yy  |  HH:mm a') : '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
    </>
  );
}