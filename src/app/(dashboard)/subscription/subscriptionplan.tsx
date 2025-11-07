"use client";
import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { CheckIcon, Sparkles, WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import axios from "axios";
import { apiConfig } from "@/lib/api-config";
import { UserContext } from "@/lib/usercontent";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Plan {
  _id: string;
  name: string;
  price: number;
  return: string[];
  status: string;
}

interface PlanDetails {
  description: string;
  subtitle: string;
  subtext: string;
  order: number;
  enable: boolean;
  tag: string;
  price: number | null;
}

interface UserProfile {
  walletBalance?: number;
  userResult: {
    currentActivePlan?: Array<{
      _id: string;
      name: string;
    }>;
    nickName: string;
    firstName: string;
    lastName: string;
    email: string;
    referralCode?: string;
    mobileNumber: string;
    totalEarning: string;
    activeDirectReferral: string;
    planPrice: string;
    ivtId: string;
    planSubscription: boolean;
  };
}

interface Purchase {
  paidAmount: number;
  subscriptionId?: string;
  createdAt?: string;
  endDate?: string;
}

const planData: { [key: string]: PlanDetails } = {
  "Stake & Earn 18": {
    tag: "New Plan",
    subtitle: "Minimum Investment:",
    price: 1000,
    subtext: `3 Payout Cycles - Every 6 Months`,
    description: `Max Earning <span className="text-foreground font-bold">3x</span><br /> Perfect for long-term investors who prefer fewer but larger returns over time.`,
    order: 1,
    enable: true,
  },
  "Stake & Earn 16": {
    tag: "New Plan",
    subtitle: "Minimum Investment:",
    price: 1000,
    subtext: `4 Payout Cycles - Every 4 Months`,
    description: `Max Earning <span className="text-foreground font-bold">3x</span><br /> Ideal for mid-term investors looking for consistent growth and stable income across the year.`,
    order: 2,
    enable: true,
  },
  "Express Diamond": {
    tag: "",
    subtitle: "Investment Range:",
    price: null,
    subtext: `For 400 Day - Total 200%`,
    description: `Total Return: <span className="text-foreground font-bold">200%</span><br /> Perfect for high-yield, high commitment investors`,
    order: 3,
    enable: true,
  },
  "Express Gold": {
    tag: "",
    subtitle: "Investment Range:",
    price: null,
    subtext: `For 500 Day - Total 200%`,
    description: `Total Return: <span className="text-foreground font-bold">200%</span><br /> Designed for smart short-to-mid-term growth`,
    order: 4,
    enable: true,
  },
  "Subscribe": {
    tag: "",
    subtitle: "Subscription Fee:",
    price: 50,
    subtext: `Access all features for 1 year`,
    description: `Duration:</b> 1 Year. Enjoy uninterrupted access to all platform features for a full year.`,
    order: 5,
    enable: true,
  }
};

export default function SubscriptionPlan() {
  const { userToken, profile } = useContext(UserContext) || {};
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [ivtId, setIvtId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [purchaseDetails, setPurchaseDetails] = useState<Purchase | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      if (!userToken) return;
      try {
        const response = await axios.post(apiConfig.trading.getPlans, {}, {
          headers: {
            "Content-Type": "application/json",
            token: userToken,
          },
        });

        if (response.data.statusCode === 200 && response.data.result) {
          const plansWithDetails = response.data.result.map((plan: Plan) => ({
            ...plan
          }));
          setPlans(plansWithDetails
            .filter((plan: Plan) => planData[plan.name]?.enable !== false)
            .sort((a: Plan, b: Plan) => 
              (planData[a.name]?.order || 0) - (planData[b.name]?.order || 0)
            ));
            //console.log(plansWithDetails);
        } else {
          toast.error("Failed to fetch plans");
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred while fetching plans";
        toast.error(errorMessage);
      }
    };

    fetchPlans();
  }, [userToken]);

  const handleBuyNow = (plan: Plan) => {
    if (!userToken) {
      toast.error("Please login to continue");
      return;
    }

    const userProfile = profile as UserProfile | undefined;
    setSelectedPlan(plan);
    setAmount(String(plan.price));
    setShowBuyDialog(true);
    setError("");
  };

  const validateAmount = (value: string) => {
    setError("");
    const numValue = Number(value);

    if (value === undefined || value === null || value === "") {
      setError("Please enter an amount");
      return false;
    }

    if (isNaN(numValue) || numValue <= 0) {
      setError("Please enter a valid amount");
      return false;
    }

    const userProfile = profile as UserProfile | undefined;
    const userBalance = userProfile?.walletBalance || 0;

    if (numValue > userBalance) {
      setError("Insufficient balance");
      return false;
    }

    if (selectedPlan && numValue !== selectedPlan.price) {
      setError(`Amount must be exactly ${formatPrice(selectedPlan.price)}`);
      return false;
    }

    if (selectedPlan?.name === "Express Pro" && !ivtId.trim()) {
      setError("IVT ID is required for Express Pro plan");
      return false;
    }

    return true;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    validateAmount(value);
  };

  const handleIvtIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIvtId(value);
    if (selectedPlan?.name === "Express Pro") {
      validateAmount(amount);
    }
  };

  const handlePurchase = async () => {
    if (!userToken || !selectedPlan) {
      toast.error("Please login to continue");
      return;
    }

    if (!validateAmount(amount)) {
      return;
    }

    if (selectedPlan.name === "Express Pro" && !ivtId) {
      setError("Please enter IVT ID");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${apiConfig.trading.buyPlan}?planId=${selectedPlan._id}&amount=${Number(amount)}${selectedPlan.name === "Express Pro" ? `&ivtId=${ivtId}` : ''}`,
        {
          queryParams: {
            planId: selectedPlan._id,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: userToken,
          },
        }
      );

      if (response.data.statusCode === 200) {
        setPurchaseDetails(response.data.result);
       // console.log(response);
        setShowBuyDialog(false);
        setShowSuccessDialog(true);
        setAmount("");
        setError("");
      } else {
        setError(response.data.responseMessage || "Failed to purchase plan");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred while processing your request";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessOk = () => {
    window.location.reload();
  };

  const isPlanActive = (plan: Plan) => {
    const userProfile = profile as UserProfile | undefined;
    return userProfile?.userResult?.currentActivePlan?.some(p => p._id === plan._id);
  };

  const isExpressProActive = () => {
    const userProfile = profile as UserProfile | undefined;
    return userProfile?.userResult?.currentActivePlan?.some(
      (activePlan) => activePlan.name === "Express Pro"
    ) ?? false;
  };

  return (
    <>
    <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3">My Subscription Plan</h2>
      <div className="flex flex-col gap-6 my-6">
        {plans.map((plan) => {
          if (!planData[plan.name]?.enable) return null;
          const userProfile = profile as UserProfile | undefined;
          const planSubscription = userProfile?.userResult?.planSubscription === true;
          const isDisabled = planSubscription;
          return (
            <Card 
              key={plan._id}
              className={`border-primary border-2 border-b-10 overflow-hidden relative w-xl max-w-full mx-auto order-${planData[plan.name]?.order} shadow-xl/50 shadow-primary/50`}
            >
              {planData[plan.name]?.tag && (
                <div className="absolute right-0 top-0 rounded-bl-lg bg-red-500 px-3 py-1 text-sm font-semibold text-foreground">
                  {planData[plan.name]?.tag}
                </div>
              )}
              <CardHeader className="pt-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-1 to-brand-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                </div>
                <div className="flex flex-wrap justify-between gap-2 text-sm items-center">
                  <span>{planData[plan.name]?.subtitle}</span>
                  <span className="text-2xl font-bold text-brand-1">
                    {plan.price ? formatPrice(plan.price) : formatPrice(planData[plan.name]?.price || 0)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex justify-center bg-primary py-2 px-6 rounded-full mx-auto w-fit font-semibold text-background mb-6 text-sm xl:text-base">
                  {planData[plan.name]?.subtext}
                </div>
                <p 
                  className="" 
                  dangerouslySetInnerHTML={{ __html: planData[plan.name]?.description || "" }}
                />
              </CardContent>
              <CardFooter>
                <Button 
                  variant="primary"
                  size="xl" 
                  className="w-full cursor-pointer"
                  onClick={() => handleBuyNow(plan)}
                  //disabled={isDisabled}
                >
                  Subscribe Now
                  {/* {isDisabled ? "Subscribed" : "Subscribe Now"} */}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Dialog open={showBuyDialog} onOpenChange={(open) => {
        setShowBuyDialog(open);
        if (!open) {
          setAmount("");
          setError("");
        }
      }}>
        <DialogContent className="border-2 border-primary [&>button]:hidden" onPointerDownOutside={(event) => {event.preventDefault()}}>
          <DialogHeader>
            <DialogTitle>Purchase Plan</DialogTitle>
            <DialogDescription>
              Enter the amount you want to invest in {selectedPlan?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
              <Label htmlFor="amount">Subscription Fee</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={selectedPlan?.price || 0}
                tabIndex={-1}
                readOnly
                onChange={handleAmountChange}
                className={error ? "border-red-500" : ""}
              />
              
              {error && (
                <p className="text-sm text-red-500 mt-1">
                  {error}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Available Balance: {formatPrice((profile as UserProfile | undefined)?.walletBalance || 0)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="lg" onClick={() => {
              setShowBuyDialog(false);
              setAmount("");
              setError("");
            }}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              size="lg"
              onClick={handlePurchase}
              disabled={isLoading || !!error}
            >
              {isLoading ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md [&>button]:hidden border-2 border-green-700">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-green-700 pt-3">
              Subscription Purchased Successfully!
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Plan Name:</span>
                  <span className="font-semibold">{selectedPlan?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subscription Fee:</span>
                  <span className="font-semibold">{formatPrice(purchaseDetails?.paidAmount || 0)}</span>
                </div>
                {purchaseDetails?.subscriptionId && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Subscription ID:</span>
                    <span className="font-semibold">{purchaseDetails?.subscriptionId}</span>
                  </div>
                )}
                {purchaseDetails?.createdAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Subscription Date:</span>
                    <span className="font-semibold">
                      {format(new Date(purchaseDetails?.createdAt || ''), 'dd-MM-yy  |  HH:mm a')}
                    </span>
                  </div>
                )}
                {purchaseDetails?.endDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">End Date:</span>
                    <span className="font-semibold">
                      {format(new Date(purchaseDetails?.endDate || ''), 'dd-MM-yy  |  HH:mm a')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleSuccessOk}
              className="w-full"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
