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
import { ArrowLeft } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { Pagination } from "@/components/pagination";
import axios from "axios";
import { apiConfig } from "@/lib/api-config";
import { UserContext } from "@/lib/usercontent";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface TeamListItem {
  amount: number;
  rewardType: string;
  _id: string;
  createdAt: string;
}

interface TeamListDetail {
  amount: number;
  rewardType: string;
  createdAt: string;
  level: number;
  senderUserData: {
    nickName: string;
  };
}

export default function TeamDividentView() {
  const [showDetails, setShowDetails] = useState(false);
  const [tableData, setTableData] = useState<TeamListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [levelViewCurrentPage, setLevelViewCurrentPage] = useState(1);
  const [currentTeamListDetails, setCurrentTeamListDetails] = useState<TeamListDetail[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [paginationMeta, setPaginationMeta] = useState({
    current_page: 1,
    limit: 20,
    total: 0,
    total_page: 1
  });
  const [levelViewPaginationMeta, setLevelViewPaginationMeta] = useState({
    current_page: 1,
    limit: 20,
    total: 0,
    total_page: 1
  });
  const { userToken } = useContext(UserContext) || {};

  useEffect(() => {
    const fetchTeamList = async () => {
      if (!userToken) return;
      try {
        setIsLoading(true);
        const headers = {
          "Content-Type": "application/json",
          token: userToken,
        };
        const res = await axios.get(`${apiConfig.team.teamDividentHistory}?page=${currentPage}&limit=${paginationMeta.limit}`, { headers });
        if (res.data.result) {
          setTableData(res.data.result[0]?.data || []);
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
  }, [userToken, currentPage]);

  const fetchTeamListDetails = async (id: string, page: number) => {
    if (!userToken) return;
    try {
      setIsDataLoading(true);
      const headers = {
        "Content-Type": "application/json",
        token: userToken,
      };
      const res = await axios.get(`${apiConfig.team.teamDividentHistoryDate}?date=${id}&page=${page}&limit=${levelViewPaginationMeta.limit}`, { headers });
      if (res.data.result) {
        setCurrentTeamListDetails(res.data.result[0]?.data || []);
        if (res.data.result[0]?.metadata?.[0]) {
          setLevelViewPaginationMeta(res.data.result[0].metadata[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching team details:", err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (showDetails && selectedId) {
      fetchTeamListDetails(selectedId, levelViewCurrentPage);
    }
  }, [showDetails, selectedId, levelViewCurrentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLevelClick = (id: string) => {
    setSelectedId(id);
    setLevelViewCurrentPage(1);
    setShowDetails(true);
  };

  const handleLevelViewPageChange = (page: number) => {
    setLevelViewCurrentPage(page);
  };

  return (
    <>
      <div className={showDetails ? "hidden" : "block"}>
        <div className="overflow-auto w-full border-2 border-primary bg-card">
          <Table className="lg:text-base">
            <TableCaption className="hidden">
              A list of your Leg.
            </TableCaption>
            <TableHeader className="bg-brand-2">
              <TableRow>
                <TableHead className="text-center text-black">Amount</TableHead>
                <TableHead className="text-center text-black">Income Type</TableHead>
                <TableHead className="text-center text-black">Date</TableHead>
                <TableHead className="text-center text-black">Action</TableHead>
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
                tableData.map((item: TeamListItem, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell className="text-center">{formatPrice(item.amount)}</TableCell>
                    <TableCell className="text-center">
                      {item?.rewardType === "TEAM_ROI" && "Team Dividend"}
                      {item?.rewardType === "ROI_MONTHLY" && "Dividend Monthly"}
                      {item?.rewardType === "ROI_DAILY" && "Dividend Daily"}
                      {item?.rewardType === "MATCHING_REWARD_BONUS" && "Matching Reward Bonus"}
                      {item?.rewardType === "MATCHING_BONUS" && "Rank Reward"}
                      {item?.rewardType === "Referral" && "Referral"}
                      {item?.rewardType === "CLUB_INCOME" && "Club Income"}
                    </TableCell>
                    <TableCell className="text-center">{item.createdAt ? format(new Date(item.createdAt), 'dd-MM-yy  |  HH:mm a') : '-'}</TableCell>
                    <TableCell className="text-center">
                      <Link
                        href="#"
                        className={buttonVariants({
                          variant: "link",
                          className: "text-sm",
                        })}
                        onClick={() => handleLevelClick(item._id)}
                      >
                        View
                      </Link>
                    </TableCell>
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
        {paginationMeta.total_page > 1 && !isLoading && (
          <Pagination
            currentPage={currentPage}
            totalPages={paginationMeta.total_page}
            onPageChange={handlePageChange}
            className="mt-4"
          />
        )}
      </div>
      <div className={showDetails ? "block" : "hidden"}>
        <div className="border-b-2 border-primary mb-3">
          <Button
            variant="primary"
            className="level_back font-semibold rounded-b-none text-sm lg:text-base px-4 py-1 min-h-12 hover:bg-primary hover:text-background cursor-pointer"
            onClick={() => {
              setShowDetails(false);
            }}
          >
            <ArrowLeft className="size-4 lg:size-5 mr-2" />
            Team Dividend Earning | {selectedId ? format(new Date(selectedId), 'dd-MM-yy') : ''}
          </Button>
        </div>
        <div className="overflow-auto w-full border-2 border-primary bg-card">
          <Table className="lg:text-base">
            <TableCaption className="hidden">
              A list of your Level.
            </TableCaption>
            <TableHeader className="bg-slate-900">
              <TableRow>
                <TableHead className="text-center">Amount</TableHead>
                <TableHead className="text-center">Income Type</TableHead>
                <TableHead className="text-center">Form / Level</TableHead>
                <TableHead className="text-center">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {isDataLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : currentTeamListDetails.length > 0 ? (
                currentTeamListDetails.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-center">{formatPrice(item.amount)}</TableCell>
                    <TableCell className="text-center">
                      {item?.rewardType === "TEAM_ROI" && "Team Dividend"}
                      {item?.rewardType === "ROI_MONTHLY" && "Dividend Monthly"}
                      {item?.rewardType === "ROI_DAILY" && "Dividend Daily"}
                      {item?.rewardType === "MATCHING_REWARD_BONUS" && "Matching Reward Bonus"}
                      {item?.rewardType === "MATCHING_BONUS" && "Rank Reward"}
                      {item?.rewardType === "Referral" && "Referral"}
                      {item?.rewardType === "CLUB_INCOME" && "Club Income"}
                    </TableCell>
                    <TableCell className="text-center">{item?.senderUserData?.nickName} / Level {item?.level}</TableCell>
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
        {levelViewPaginationMeta.total_page > 1 && !isDataLoading && (
          <Pagination
            currentPage={levelViewCurrentPage}
            totalPages={levelViewPaginationMeta.total_page}
            onPageChange={handleLevelViewPageChange}
            className="mt-4"
          />
        )}
      </div>
    </>
  );
}