"use client";
import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { CheckIcon } from "lucide-react";
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
  minPrice: number;
  maxPrice: number;
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
  "Express Pro": {
    tag: "",
    subtitle: "Investment Range:",
    price: null,
    subtext: `7% Monthly - Lifetime Earning`,
    description: `Earnings: Lifetime Earning Potential <br />Ideal for investors seeking steady, long-term returns`,
    order: 3,
    enable: true,
  },
  "Express Diamond": {
    tag: "",
    subtitle: "Investment Range:",
    price: null,
    subtext: `For 400 Day - Total 200%`,
    description: `Total Return: <span className="text-foreground font-bold">200%</span><br /> Perfect for high-yield, high commitment investors`,
    order: 4,
    enable: true,
  },
  "Express Gold": {
    tag: "",
    subtitle: "Investment Range:",
    price: null,
    subtext: `For 500 Day - Total 200%`,
    description: `Total Return: <span className="text-foreground font-bold">200%</span><br /> Designed for smart short-to-mid-term growth`,
    order: 5,
    enable: true,
  },
  // "Subscribe": {
  //   tag: "",
  //   subtitle: "Minimum Investment:",
  //   price: 50,
  //   subtext: `1 Year`,
  //   description: ``,
  //   order: 6,
  //   enable: true,
  // }
};

export default function InvestmentPlan() {
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
    //console.log(userProfile);
    // if (userProfile?.userResult?.currentActivePlan) {
    //   toast.error("You already have an active plan");
    //   return;
    // }

    setSelectedPlan(plan);
    setShowBuyDialog(true);
  };

  const validateAmount = (value: string) => {
    setError("");
    const numValue = Number(value);
    
    if (!value) {
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

    if (selectedPlan && (numValue < selectedPlan.minPrice || numValue > selectedPlan.maxPrice)) {
      setError(`Amount must be between ${formatPrice(selectedPlan.minPrice)} and ${formatPrice(selectedPlan.maxPrice)}`);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        {plans.map((plan) => {
          if (!planData[plan.name]?.enable) return null;
          
          const isExpressPro = plan.name === "Express Pro";
          const isDisabled = isExpressPro && isExpressProActive();
          
          return (
            <Card 
              key={plan._id}
              className={`border-primary border-2 overflow-hidden relative order-${planData[plan.name]?.order}`}
            >
              {planData[plan.name]?.tag && (
                <div className="absolute right-0 top-0 rounded-bl-lg bg-red-500 px-3 py-1 text-sm font-semibold text-foreground">
                  {planData[plan.name]?.tag}
                </div>
              )}
              <CardHeader className="pt-3">
                <CardTitle className="text-2xl font-bold text-shadow-xs text-primary">
                  {plan.name}
                </CardTitle>
                <div className="flex flex-wrap justify-between gap-2 text-sm items-center">
                  <span>{planData[plan.name]?.subtitle}</span>
                  <span className="text-xl font-bold">
                    {planData[plan.name]?.price ? (
                      formatPrice(planData[plan.name]?.price || 0)
                    ) : (
                      `${formatPrice(plan.minPrice)} - ${formatPrice(plan.maxPrice)}`
                    )}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex justify-center bg-primary py-2 px-6 rounded-full mx-auto w-fit font-semibold text-background mb-6 text-sm xl:text-base">
                  {planData[plan.name]?.subtext}
                </div>
                <p 
                  className="text-muted-foreground" 
                  dangerouslySetInnerHTML={{ __html: planData[plan.name]?.description || "" }}
                />
              </CardContent>
              <CardFooter>
                <Button 
                  variant="primary"
                  size="xl" 
                  className="w-full cursor-pointer"
                  onClick={() => handleBuyNow(plan)}
                  disabled={isDisabled}
                >
                  {isDisabled ? "Active Plan" : "Buy Now"}
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
        <DialogContent className="border-2 border-primary">
          <DialogHeader>
            <DialogTitle className="text-primary">Purchase Plan</DialogTitle>
            <DialogDescription>
              Enter the amount you want to invest in {selectedPlan?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
            {selectedPlan?.name === "Express Pro" && (
                <>
                  <Label htmlFor="ivtId">IVT ID</Label>
                  <Input
                    id="ivtId"
                    type="text"
                    placeholder="Enter IVT ID"
                    value={profile?.userResult?.ivtId || ivtId}
                    onChange={handleIvtIdChange}
                    className={error && !ivtId ? "border-red-500" : ""}
                    required
                  />
                  <Link 
                    href="https://trade.ivt-markets.com/register/" 
                    target="_blank" 
                    className="text-sm text-primary hover:underline"
                  >
                    Don't have IVT account? Click Here!
                  </Link>
                </>
              )}
              <Label htmlFor="amount">Investment Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={handleAmountChange}
                min={selectedPlan?.minPrice}
                max={selectedPlan?.maxPrice}
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
              <p className="text-sm text-muted-foreground">
                Investment Range: {formatPrice(selectedPlan?.minPrice || 0)} - {formatPrice(selectedPlan?.maxPrice || 0)}
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
              disabled={isLoading || !amount || !!error}
            >
              {isLoading ? "Processing..." : "Confirm Purchase"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md [&>button]:hidden border-2 border-primary">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-primary pt-3">
              Plan Purchased Successfully!
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
                  <span className="text-muted-foreground">Investment Amount:</span>
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
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
