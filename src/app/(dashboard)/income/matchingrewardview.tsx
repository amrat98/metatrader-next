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
import { useState, useEffect, useContext, useCallback } from "react";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { apiConfig } from "@/lib/api-config";
import { UserContext } from "@/lib/usercontent";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface TeamListItem {
  isClaimed: boolean;
  matchAmout: number;
  reward: string;
  rewardAmount: number;
  status: boolean;
  _id: string;
}

interface UserContextType {
  teamComposition?: {
    matchLot: number;
    CMRV: number;
  };
  userToken?: string;
}

const otpFormSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

type OtpFormData = z.infer<typeof otpFormSchema>;

export default function MatchingRewardView() {
  const { teamComposition, userToken } = useContext(UserContext) as UserContextType;
  const [tableData, setTableData] = useState<TeamListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [paginationMeta, setPaginationMeta] = useState({
    current_page: 1,
    limit: 20,
    total: 0,
    total_page: 1
  });
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [selectedRewardId, setSelectedRewardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string>("");

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const fetchTeamList = useCallback(async () => {
    if (!userToken) return;
    try {
      setIsTableLoading(true);
      const headers = {
        "Content-Type": "application/json",
        token: userToken,
      };
      const res = await axios.get(apiConfig.rewards.getRewardData, { headers });
      if (res.data.result) {
        const allData = res.data.result || [];
        setTableData(allData);
        // Calculate pagination metadata
        const total = allData.length;
        const total_page = Math.ceil(total / paginationMeta.limit);
        setPaginationMeta(prev => ({
          ...prev,
          total,
          total_page,
          current_page: currentPage > total_page ? 1 : currentPage
        }));
      }
    } catch (err) {
      console.error("Error fetching team list:", err);
    } finally {
      setIsTableLoading(false);
    }
  }, [userToken, currentPage, paginationMeta.limit]);

  const handleClaimReward = async (rewardId: string) => {
    try {
      setIsLoading(true);
      setFormError("");
      
      const response = await axios.post(
        apiConfig.rewards.claimReward,
        { rewardId },
        {
          headers: {
            "Content-Type": "application/json",
            token: userToken,
          },
        }
      );

     // console.log('Claim Reward Response:', response);

      // Check if response and response.data exist
      if (!response?.data) {
        throw new Error('Invalid response from server');
      }

      // Check if the response has the expected structure
      if (response.data.statusCode === 200) {
        setSelectedRewardId(rewardId);
        setShowOtpDialog(true);
        toast.success("OTP sent to your email");
      } else {
        const errorMessage = response.data.responseMessage || "Failed to claim reward";
        toast.error(errorMessage);
        setFormError(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred while claiming reward";
      toast.error(errorMessage);
      setFormError(errorMessage);
      console.error("Error claiming reward:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (values: OtpFormData) => {
    try {
      setIsLoading(true);
      setFormError("");
      
      if (!selectedRewardId) {
        throw new Error('No reward selected');
      }

      const response = await axios.post(
        apiConfig.rewards.verifyRewardClaim,
        {
          rewardId: selectedRewardId,
          otp: values.otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: userToken,
          },
        }
      );

     // console.log('Verify OTP Response:', response);

      // Check if response and response.data exist
      if (!response?.data) {
        throw new Error('Invalid response from server');
      }

      // Check if the response has the expected structure
      if (response.data.statusCode === 200) {
        toast.success("Reward claimed successfully");
        setShowOtpDialog(false);
        otpForm.reset();
        // Refresh the rewards list
        await fetchTeamList();
      } else {
        const errorMessage = response.data.responseMessage || "Invalid OTP";
        setFormError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred while verifying OTP";
      setFormError(errorMessage);
      toast.error(errorMessage);
      console.error("Error verifying OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamList();
  }, [fetchTeamList]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate current page items
  const startIndex = (currentPage - 1) * paginationMeta.limit;
  const endIndex = startIndex + paginationMeta.limit;
  const currentItems = tableData.slice(startIndex, endIndex);

  const otpInputStyles = {
    slot: "sm:h-12 sm:w-12 text-lg font-semibold border-2 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20",
    group: "sm:gap-2",
    separator: "mx-2",
    container: "gap-4",
    formItem: "flex flex-col items-center mt-4",
    label: "text-base mb-4 hidden",
    message: "text-sm mt-2",
  } as const;


  return (
    <>
      <div className="overflow-auto w-full border-2 border-primary bg-card">
        <Table className="lg:text-base">
          <TableCaption className="hidden">
            A list of your Leg.
          </TableCaption>
          <TableHeader className="bg-brand-2">
            <TableRow>
              <TableHead className="text-center text-black">No</TableHead>
              <TableHead className="text-center text-black">Required / Matching</TableHead>
              <TableHead className="text-center text-black">Matching Reward</TableHead>
              <TableHead className="text-center text-black">Status</TableHead>
              <TableHead className="text-center text-black">Claim</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {isTableLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : currentItems.length > 0 ? (
              currentItems.map((item: TeamListItem, idx: number) => (
                <TableRow key={idx}>
                  <TableCell className="text-center">{startIndex + idx + 1}</TableCell>
                  <TableCell className="text-center">
                    {formatPrice(item?.matchAmout,2,false)}
                    {(() => {
                      const hasTeam = teamComposition && typeof teamComposition.CMRV === 'number';
                      const matchAmount = item?.matchAmout ?? 0;
                      const matchLot = teamComposition && typeof teamComposition.matchLot === 'number' ? teamComposition.matchLot : 0;
                      const CMRV = teamComposition && typeof teamComposition.CMRV === 'number' ? teamComposition.CMRV : 0;

                      if (hasTeam && (CMRV >= matchAmount || matchLot - CMRV >= matchAmount)) {
                        return (
                          <span className="text-green-500">
                            {" "}/ {formatPrice(matchAmount,2,false)}
                          </span>
                        );
                      } else {
                        return (
                          <span className="text-red-500">
                            {" "}/ {formatPrice(matchLot - CMRV,2,false)}
                          </span>
                        );
                      }
                    })()}
                  </TableCell>
                  <TableCell className="text-center">{item?.reward}</TableCell>
                  <TableCell className="text-center">
                  {(() => {
                      const hasTeam = teamComposition && typeof teamComposition.CMRV === 'number';
                      const matchAmount = item?.matchAmout ?? 0;
                      const matchLot = teamComposition && typeof teamComposition.matchLot === 'number' ? teamComposition.matchLot : 0;
                      const CMRV = teamComposition && typeof teamComposition.CMRV === 'number' ? teamComposition.CMRV : 0;

                      if (hasTeam && (CMRV >= matchAmount || matchLot - CMRV >= matchAmount)) {
                        return (
                          "Achieved"
                        );
                      } else {
                        return (
                          "Pending..."
                        );
                      }
                    })()}
                  </TableCell>
                  <TableCell className="text-center">
                    {item?.isClaimed === true ? (
                      <Button className="text-sm" variant="success">Claimed</Button>
                    ) : teamComposition && typeof teamComposition.matchLot === 'number' && typeof teamComposition.CMRV === 'number' && teamComposition.matchLot - teamComposition.CMRV >= item?.matchAmout ? (
                      <Button
                        className="text-sm"
                        variant="primary"
                        onClick={() => handleClaimReward(item?._id)}
                        disabled={isLoading}
                      >
                        Claim
                      </Button>
                    ) : (
                      <Button className="text-sm cursor-not-allowed pointer-events-none" variant="outline">Pending</Button>
                    )}
                  </TableCell>
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

      {/* OTP Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-primary">Verify OTP</DialogTitle>
            <DialogDescription>
              Please enter the 6-digit OTP sent to your email.
            </DialogDescription>
          </DialogHeader>
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4">
              {formError && (
                <div className="text-sm text-red-500 mb-4">
                  {formError}
                </div>
              )}
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        autoComplete="off"
                        onChange={(value) => {
                          field.onChange(value);
                          otpForm.trigger("otp");
                        }}
                        className={otpInputStyles.container}
                      >
                        <InputOTPGroup className={otpInputStyles.group}>
                          <InputOTPSlot
                            index={0}
                            className={otpInputStyles.slot}
                          />
                          <InputOTPSlot
                            index={1}
                            className={otpInputStyles.slot}
                          />
                          <InputOTPSlot
                            index={2}
                            className={otpInputStyles.slot}
                          />
                          <InputOTPSlot
                            index={3}
                            className={otpInputStyles.slot}
                          />
                          <InputOTPSlot
                            index={4}
                            className={otpInputStyles.slot}
                          />
                          <InputOTPSlot
                            index={5}
                            className={otpInputStyles.slot}
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 mt-10">
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    setShowOtpDialog(false);
                    otpForm.reset();
                    setFormError("");
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}