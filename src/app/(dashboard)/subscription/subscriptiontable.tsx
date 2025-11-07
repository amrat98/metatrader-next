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

interface PlanDetails {
  name: string;
  status: boolean;
}

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
  planDetails?: PlanDetails;
  price?: number;
}

export default function SubscriptionTable() {
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

  useEffect(() => {
    const fetchData = async () => {
      if (!userToken) return;
      try {
        setIsLoading(true);
        const headers = {
          "Content-Type": "application/json",
          token: userToken,
        };
        const res = await axios.get(apiConfig.trading.getPlanHistory,
          { headers }
        );
       // console.log(res);
        if (res.data.result) {
          setTableData(res.data.result[0]?.data?.reverse() || []);
          //console.log(res);
          if (res.data.result[0].metadata[0]) {
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
      } catch (err) {
        console.error("Error fetching transaction history:", err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [userToken, paginationMeta.current_page, paginationMeta.limit]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setPaginationMeta(prev => ({
      ...prev,
      current_page: page
    }));
  };

  return (
    <>
    {tableData.length > 0  && (
    <>
      <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3">My Subscription</h2>
      <div className="overflow-auto w-full border-2 border-brand-2 bg-card">
        <Table className="lg:text-base">
          <TableCaption className="hidden">
            A list of your transactions.
          </TableCaption>
          <TableHeader className="bg-brand-2">
            <TableRow className="border-brand-1/60">
              <TableHead className="text-center text-black">Name</TableHead>
              <TableHead className="text-center text-black">Amount</TableHead>
              <TableHead className="text-center text-black">Status</TableHead>
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
            ) : tableData.length > 0 ? (
              tableData.map((item, index) => (
                <TableRow key={`${item.id}-${index}`}>
                  <TableCell className="text-center">{item?.planDetails?.name || "-"}</TableCell>
                  <TableCell className="text-center">{formatPrice(item.price || 0)}</TableCell>
                  <TableCell className="text-center">
                    <span className={`py-1 px-3 rounded-sm text-sm min-w-20 inline-block font-semibold ${
                      item.planDetails?.status ? 'bg-green-600' : 'bg-red-500'
                    }`}>
                      {item.planDetails?.status ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">{item.createdAt ? format(new Date(item.createdAt), 'dd-MM-yy  |  HH:mm a') : '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No Subscription data
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
    )}
    </>
  );
}