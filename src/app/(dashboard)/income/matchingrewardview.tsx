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
import { format } from "date-fns";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { apiConfig } from "@/lib/api-config";
import { UserContext } from "@/lib/usercontent";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Gift, History, Laptop, Plane, Sparkle, Tablet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TeamListItem {
  isClaimed: boolean;
  matchAmout: number;
  reward: string;
  rewardAmount: number;
  status: boolean;
  _id: string;
  createdAt: string;
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
      const errorMessage = error instanceof Error ?  error.message : "An error occurred while claiming reward";
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
      {isTableLoading ? (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_,i) => (
          <div key={i} className="p-4 rounded-xl transition-all duration-300 border meta-border">
            <div className="flex flex-col space-y-3">
              <Skeleton className="w-full aspect-video rounded-xl bg-brand-1/30" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-brand-1/30" />
                <Skeleton className="h-4 w-2/3 bg-brand-1/30" />
              </div>
            </div>
          </div>
        ))}
        </div>
      </>
      ): (
        <>
        {currentItems.length === 0 ? (
          <div className="text-center py-12">
          <History className="w-16 h-16 mx-auto mb-4 text-slate-600" />
          <p className="text-slate-400">No Rewards yet</p>
          </div>
        ): (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {currentItems.map((item: TeamListItem, idx: number) => (
          <Card key={idx} className="glass-effect hover:scale-105 transition-all duration-300 group flex-1 gap-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-brand-5 text-lg text-white">{item.reward}</CardTitle>
                  <div className="text-xs text-muted-foreground font-medium">
                    Created {format(new Date(item.createdAt), 'MMM dd, yyyy')}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-extra-4 to-extra-5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {item.reward === 'Tablet' ? <Tablet className="w-5 h-5 text-white" />
                  : item.reward === 'Laptop' ? <Laptop className="w-5 h-5 text-white" />
                  : item.reward === 'Dubai Tour' ? <Plane className="w-5 h-5 text-white" />
                  : item.reward === 'Dubai Villa' ? <Plane className="w-5 h-5 text-white" />
                  : item.reward === 'Kia Carens Car' ? <Car className="w-5 h-5 text-white" />
                  : item.reward === 'Mercedes Car' ? <Car className="w-5 h-5 text-white" />
                  : item.reward === 'Defender Car' ? <Car className="w-5 h-5 text-white" />
                  : <Gift className="w-5 h-5 text-white" />
                  }
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-2 rounded-lg meta-shine meta-border space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Target</span>
                  <span className="text-sm font-semibold text-emerald-400">{formatPrice(item?.matchAmout,2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Required</span>
                  {(() => {
                      const hasTeam = teamComposition && typeof teamComposition.CMRV === 'number';
                      const matchAmount = item?.matchAmout ?? 0;
                      const matchLot = teamComposition && typeof teamComposition.matchLot === 'number' ? teamComposition.matchLot : 0;
                      const CMRV = teamComposition && typeof teamComposition.CMRV === 'number' ? teamComposition.CMRV : 0;

                      if (hasTeam && (CMRV >= matchAmount || matchLot - CMRV >= matchAmount)) {
                        return (
                          <span className="text-sm font-semibold text-emerald-400">
                          {formatPrice(matchAmount,2)}
                          </span>
                        );
                      } else {
                        return (
                          <span className="text-sm font-medium text-destructive">
                          {formatPrice(matchLot - CMRV,2)}
                          </span>
                        );
                      }
                    })()}
                  {/* <span className="text-lg font-bold text-emerald-400">
                    ${listing.price_per_carat}
                  </span> */}
                </div>
                {/* <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                  <span className="text-xs text-slate-400">Total Value</span>
                  <span className="text-base font-bold text-white">${listing.total_value.toFixed(2)}</span>
                </div> */}
              </div>
              {/* <p className="text-sm text-slate-400">Available for trading and withdrawal</p> */}
              {item?.isClaimed === true ? (
                <Button className="text-sm w-full" disabled variant="success">Claimed</Button>
              ) : teamComposition && typeof teamComposition.matchLot === 'number' && typeof teamComposition.CMRV === 'number' && teamComposition.matchLot - teamComposition.CMRV >= item?.matchAmout ? (
                <Button
                  className="text-sm w-full"
                  variant="success"
                  onClick={() => handleClaimReward(item?._id)}
                  disabled={isLoading}
                >
                {isLoading ? "Claiming..." : "Claim Reward" }
                </Button>
              ) : (
                <Button className="text-sm cursor-not-allowed pointer-events-none w-full bg-brand-1/20!" variant="outline">Pending</Button>
              )}
            </CardContent>
          </Card>
        ))}
        </div>
        </>
        )}
        </>
      )}

      {/* OTP Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="mb-4">
            <DialogTitle>Verify OTP</DialogTitle>
            <DialogDescription className="text-brand-5/60">
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
                  variant="outline"
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
                  variant="success"
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