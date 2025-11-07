"use client";
import * as React from "react";
import { useState, useEffect, useContext } from "react";
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
import { UserContext } from "@/lib/usercontent";
import { feedbackService } from "@/lib/services/feedback.service";

interface FeedbackData {
  _id: string;
  feedbackType: string;
  description: string;
  status: string;
  createdAt: string;
  fileUrl?: string;
}

export default function SupportTable() {
  const [tableData, setTableData] = useState<FeedbackData[]>([]);
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
        const res = await feedbackService.getFeedbackList(userToken, currentPage, paginationMeta.limit);
        // Assume result.data is the array, and result.metadata[0] is the pagination info
        if (res.result) {
          setTableData(res.result[0].data || []);
          if (res.result.metadata && res.result[0].metadata[0]) {
            const metadata = res.result[0].metadata[0];
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
        console.error("Error fetching feedback list:", err);
        setTableData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userToken, currentPage, paginationMeta.limit]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setPaginationMeta(prev => ({
      ...prev,
      current_page: page
    }));
  };

  return (
    <>
      <h2 className="text-primary text-lg md:text-xl lg:text-2xl font-semibold mb-3">
        My Tickets
      </h2>
      <div className="overflow-auto w-full border-2 border-primar bg-card">
        <Table className="lg:text-base">
          <TableCaption className="hidden">
            A list of your ticket submissions.
          </TableCaption>
          <TableHeader className="bg-slate-900">
            <TableRow>
            <TableHead className="text-center">Ticket ID</TableHead>
              <TableHead className="text-center">Ticket Type</TableHead>
              <TableHead className="text-center">Description</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Date</TableHead>
              {/* <TableHead className="text-center">File</TableHead> */}
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
                <TableRow key={`${item._id}-${index}`}>
                  <TableCell className="text-center">{item._id || "-"}</TableCell>
                  <TableCell className="text-center">{item.feedbackType || "-"}</TableCell>
                  <TableCell className="text-center max-w-xs truncate" title={item.description}>{item.description || "-"}</TableCell>
                  <TableCell className="text-center">
                    <span className={`py-1 px-3 rounded-sm text-sm min-w-20 inline-block font-semibold ${
                      item.status === 'resolved' ? 'bg-green-600' : 'bg-yellow-500'
                    }`}>
                      {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Pending'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">{item.createdAt ? format(new Date(item.createdAt), 'dd-MM-yy  |  HH:mm a') : '-'}</TableCell>
                  {/* {item.fileUrl && (
                    <TableCell className="text-center">
                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a>
                    </TableCell>
                  )} */}
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
    </>
  );
}