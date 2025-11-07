import React, { useState, useContext } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { formatPrice } from "@/lib/utils";
import axios from "axios";
import { apiConfig } from "@/lib/api-config";
import { UserContext } from "@/lib/usercontent";
import Image from "next/image";

// Local UserProfile type for prop typing
type UserProfile = {
  eligible: number;
  invitationUserName: string;
  level: number;
  multiQ: number;
  multiplier: number;
  remainingEarning: number;
  totalDeposit: number;
  totalEarning: number;
  walletBalance: number;
  withdrawlIncome: number;
  userResult: {
    _id: string;
    nickName: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    activeDirectReferral: number;
    activeTeamSize: number;
    cryptoAddress: string;
    directTeamBusiness: number;
    isSubscribe: boolean;
    referralCodeA: string;
    referralCodeB: string;
    status: string;
    totalEarning: string;
    totalPlanPrice: string;
    planPrice: string;
    planSubscription: boolean;
    createdAt: string;
    activationDate: string;
    invitationCode: string;
    ivtId: string;
    fxAccountBalance: number;
    fxAccountNumber: string;
    fxAccountStatus: string;
    fxAcountProfit: string;
    fxBroker: string;
    fxLevel: string;
    isBillionaire: boolean;
  };
};

const getCardGradient = (fxLevel?: string) => {
  if (fxLevel?.toLowerCase() === "gold") {
    return "from-amber-200 to-yellow-500";
  }
  if (fxLevel?.toLowerCase() === "diamond") {
    return "from-gray-200 to-gray-400";
  }
  return "from-slate-200 to-slate-400";
};

interface CreditCardProps {
  profile: UserProfile;
}

const CreditCard: React.FC<CreditCardProps> = ({ profile }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [fxAccountNumber, setFxAccountNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { userToken, setProfile } = useContext(UserContext) || {};

  // Show blank card if no fxAccountNumber
  if (!profile.userResult.fxAccountNumber && profile.userResult.fxAccountStatus !== "APPROVED") {
    return (
      <>
        <div
          className={`credit-card relative max-w-full w-96 h-60 gap-4 flex flex-col items-center px-4 py-8 rounded-2xl font-mono text-black overflow-hidden cursor-pointer transition-all duration-500 bg-gradient-to-r ${getCardGradient(profile.userResult.fxLevel)}`}
          onClick={() => setShowDialog(true)}
        >
          {/* <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-lg bg-gray-950/[2.5%] after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:inset-ring after:inset-ring-gray-950/5 dark:after:inset-ring-white/10 bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-950)]/5 dark:[--pattern-fg:var(--color-white)]/30"></div> */}
          <div className="absolute inset-0 bg-[url('/credit-card.png')] bg-cover bg-center opacity-80 pointer-events-none z-0"></div>
          <div className="flex justify-between w-full gap-4 z-1 relative">
          <Image
          className="h-8 w-auto block object-contain bg-white/50 p-1 rounded-sm"
          src="/chip.svg"
          alt="Chip"
          width={100}
          height={100}
          priority
        />
            {/* <span>{profile.userResult.fxLevel || "-"}</span> */}
            <span>{formatPrice(profile.userResult.fxAccountBalance ?? 0)}</span>
          </div>
          <div className="flex-1 w-full flex justify-center items-center text-2xl tracking-[.2em] text-gray-400 z-1 relative">
            ---- ---- ---- ----
          </div>
          <div className="flex justify-between w-full gap-4 text-base hidden">
            <span>
              <span className="block text-xs uppercase tracking-widest">Card holder</span>
              {profile.userResult.firstName} {profile.userResult.lastName}
            </span>
            <span>
              <span className="block text-xs uppercase tracking-widest">Active Date</span>
              {profile.userResult.activationDate
                ? format(new Date(profile.userResult.activationDate), "dd/MM/yy")
                : "-"}
            </span>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/80 transition z-1 cursor-pointer"
            onClick={e => { e.stopPropagation(); setShowDialog(true); }}
          >
            Link FX Account Holder
          </button>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent  onPointerDownOutside={e => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Enter FX Account Number</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setError("");
                try {
                  const response = await axios.put(
                    apiConfig.profile.updateProfile,
                    { fxAccountNumber },
                    {
                      headers: {
                        "Content-Type": "application/json",
                        token: userToken,
                      },
                    }
                  );
                  if (response.data.statusCode === 200 || response.data.result) {
                    setSubmitted(true);
                    setShowDialog(false);
                    // Optionally update profile in context
                    if (typeof setProfile === 'function' && profile && profile.userResult) {
                      setProfile({
                        ...profile,
                        userResult: {
                          ...profile.userResult,
                          fxAccountNumber,
                          fxAccountStatus: "PENDING"
                        }
                      });
                    }
                  } else {
                    setError(response.data.responseMessage || "Failed to update FX Account Number");
                  }
                } catch (error) {
                  if (axios.isAxiosError(error)) {
                    setError(error.response?.data?.responseMessage);
                  } else {
                  const errorMessage = error instanceof Error ? error.message : "An error occurred";
                  setError(errorMessage);
                  }
                  //setError(err?.response?.data?.responseMessage || "An error occurred");
                } finally {
                  setLoading(false);
                }
              }}
              className="flex flex-col gap-4"
            >
              <Input
                type="text"
                placeholder="FX Account Number"
                value={fxAccountNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setFxAccountNumber(value);
                  }
                }}
                required
                disabled={loading}
              />
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <DialogFooter>
                <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {submitted && (
          <div className="mt-4 text-green-600 font-semibold text-center">
            FX Account Number is confirmed and waiting for approval.
          </div>
        )}
      </>
    );
  }

  // Show card with waiting message if status is PENDING and fxAccountNumber is present
  if (
    profile.userResult.fxAccountStatus === "PENDING" &&
    profile.userResult.fxAccountNumber &&
    profile.userResult.fxAccountNumber !== ""
  ) {
    return (
      <div
        className={`credit-card relative max-w-full w-96 h-60 gap-4 flex flex-col items-center px-4 py-8 rounded-2xl font-mono text-black overflow-hidden cursor-pointer transition-all duration-500 bg-gradient-to-r ${getCardGradient(profile.userResult.fxLevel)}`}
      >
        {/* <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-lg bg-gray-950/[2.5%] after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:inset-ring after:inset-ring-gray-950/5 dark:after:inset-ring-white/10 bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-950)]/5 dark:[--pattern-fg:var(--color-white)]/30"></div> */}
        <div className="absolute inset-0 bg-[url('/credit-card.png')] bg-cover bg-center opacity-80 pointer-events-none z-0"></div>
        <div className="flex justify-between w-full gap-4 z-1 relative">
        <Image
          className="h-8 w-auto block object-contain bg-white/50 p-1 rounded-sm"
          src="/chip.svg"
          alt="Chip"
          width={100}
          height={100}
          priority
        />
          {/* <span>{profile.userResult.fxLevel}</span> */}
          <span>{formatPrice(profile.userResult.fxAccountBalance ?? 0)}</span>
        </div>
        <div className="flex-1 w-full flex justify-center items-center text-2xl tracking-[.2em] z-1 relative">
          {profile.userResult.fxAccountNumber}
        </div>
        <div className="flex justify-between w-full gap-4 text-base z-1 relative">
          <span>
            <span className="block text-xs uppercase tracking-widest">Card holder</span>
            {profile.userResult.firstName} {profile.userResult.lastName}
          </span>
          <span>
            <span className="block text-xs uppercase tracking-widest">Active Date</span>
            {profile.userResult.activationDate
              ? format(new Date(profile.userResult.activationDate), "dd/MM/yy")
              : "-"}
          </span>
        </div>
        <div className="mt-2 text-red-600 font-semibold text-center z-1 relative">
          Waiting for approval...
        </div>
      </div>
    );
  }

  // Only show the real card if status is APPROVED
  if (profile.userResult.fxAccountStatus !== "APPROVED") return null;

  return (
    <>
      <div
        className={`credit-card relative max-w-full w-96 h-60 gap-4 flex flex-col items-center px-4 py-8 rounded-2xl font-mono text-black overflow-hidden cursor-pointer transition-all duration-500 bg-gradient-to-r ${getCardGradient(profile.userResult.fxLevel)}`}
      >
        {/* <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-lg bg-gray-950/[2.5%] after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:inset-ring after:inset-ring-gray-950/5 dark:after:inset-ring-white/10 bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-950)]/5 dark:[--pattern-fg:var(--color-white)]/30"></div> */}
        <div className="absolute inset-0 bg-[url('/credit-card.png')] bg-cover bg-center opacity-80 pointer-events-none z-0"></div>

        <div className="flex justify-between w-full gap-4 z-1 relative">
        <Image
          className="h-8 w-auto block object-contain bg-white/50 p-1 rounded-sm"
          src="/chip.svg"
          alt="Chip"
          width={100}
          height={100}
          priority
        />
          {/* <span>{profile.userResult.fxLevel}</span> */}
          <span>{formatPrice(profile.userResult.fxAccountBalance ?? 0)}</span>
        </div>
        <div className="flex-1 w-full flex justify-center items-center text-2xl tracking-[.2em] z-1 relative">
          {profile.userResult.fxAccountNumber}
        </div>
        <div className="flex justify-between w-full gap-4 text-base z-1 relative">
          <span>
            <span className="block text-xs uppercase tracking-widest">Card holder</span>
            {profile.userResult.firstName} {profile.userResult.lastName}
          </span>
          <span>
            <span className="block text-xs uppercase tracking-widest">Active Date</span>
            {profile.userResult.activationDate
              ? format(new Date(profile.userResult.activationDate), "dd/MM/yy")
              : "-"}
          </span>
        </div>
      </div>
    </>
  );
};

export default CreditCard; 