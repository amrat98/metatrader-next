"use client";
import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { routes } from "@/lib/routes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatPrice } from "@/lib/utils";
import axios from "axios";
import { apiConfig } from "@/lib/api-config";
import { UserContext } from "@/lib/usercontent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from 'html5-qrcode';

interface GlobalAsset {
  incomeBalance: number;
  balance: number;
  dailyWithdrawLimit: number;
}
interface FormData {
  address: string;
  amount: string;
  transactionPassword: string;
  verificationCode: string;
}
interface FormErrors {
  address?: string;
  amount?: string;
  transactionPassword?: string;
  verificationCode?: string;
}

export default function Transfer() {
  const { profile, userRank, setProfile } = useContext(UserContext) || {};
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const [formData, setFormData] = useState<FormData>({
    address: profile?.userResult?.cryptoAddress || "",
    amount: "",
    transactionPassword: "",
    verificationCode: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const [getCodeLoading, setGetCodeLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);

  const userContext = useContext(UserContext);
  const userToken = userContext?.userToken;
  const { globalasset } = useContext(UserContext) || {};
  const asset = globalasset as GlobalAsset | undefined;

  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [resendTimer]);
  useEffect(() => {
    if (isVerified) {
      setResendTimer(0);
    }
  }, [isVerified]);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.address) {
      newErrors.address = "Address is required";
    } else if (formData.address.length < 30 || formData.address.length > 42) {
      newErrors.address = "Address must be between 30 and 42 characters";
    }
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else {
      const amount = Number(formData.amount);
      if (amount <= 0) {
        newErrors.amount = "Amount must be greater than 0";
      } else if (amount > (asset?.balance || 0)) {
        newErrors.amount = "Amount exceeds available balance";
      } else if (amount > (asset?.dailyWithdrawLimit || 0)) {
        newErrors.amount = `Amount exceeds daily withdrawal limit of ${formatPrice(asset?.dailyWithdrawLimit || 0)}`;
      }
    }
    if (!formData.transactionPassword) {
      newErrors.transactionPassword = "Transaction password is required";
    }
    if (isVerifying && !formData.verificationCode) {
      newErrors.verificationCode = "Verification code is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateBeforeGetCode = () => {
    const newErrors: FormErrors = {};
    if (!formData.address) {
      newErrors.address = "Address is required";
    } else if (formData.address.length < 30 || formData.address.length > 42) {
      newErrors.address = "Address must be between 30 and 42 characters";
    }
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else {
      const amount = Number(formData.amount);
      if (amount <= 0) {
        newErrors.amount = "Amount must be greater than 0";
      } else if (amount > (asset?.balance || 0)) {
        newErrors.amount = "Amount exceeds available balance";
      } else if (amount > (asset?.dailyWithdrawLimit || 0)) {
        newErrors.amount = `Amount exceeds daily withdrawal limit of ${formatPrice(asset?.dailyWithdrawLimit || 0)}`;
      }
    }
    if (!formData.transactionPassword) {
      newErrors.transactionPassword = "Transaction password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleMaxAmount = () => {
    const maxAmount = asset?.balance || 0;
    setFormData(prev => ({ ...prev, amount: maxAmount.toString() }));
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: undefined }));
    }
  };

  const handleGetCode = async () => {
    if (getCodeLoading) return;
    setGetCodeLoading(true);
    try {
      if (!validateBeforeGetCode()) {
        setGetCodeLoading(false);
        return;
      }
      const response = await axios.post(
        apiConfig.assets.transferAssets,
        {
          walletAddress: formData.address,
          amount: formData.amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: userToken,
          },
        }
      );
      if (response.data.statusCode === 200) {
        toast.success("OTP sent successfully");
        setIsVerifying(true);
        setResendTimer(60);
      } else {
        toast.error(response.data.responseMessage || "Failed to send OTP");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.responseMessage || "Failed to send OTP");
      } else {
        toast.error("Failed to send OTP");
      }
    } finally {
      setGetCodeLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verifyLoading) return;
    setVerifyLoading(true);
    try {
      if (!validateForm()) {
        setVerifyLoading(false);
        return;
      }
      const response = await axios.put(
        apiConfig.assets.verifyOtp,
        { otp: parseInt(formData.verificationCode) },
        { headers: { "Content-Type": "application/json", token: userToken } }
      );
      if (response.data.statusCode === 200) {
        toast.success("OTP verified successfully");
        setIsVerified(true);
        const verificationInput = document.getElementById('verificationCode') as HTMLInputElement;
        if (verificationInput) verificationInput.readOnly = true;
      } else {
        toast.error(response.data.responseMessage || "Failed to verify OTP");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.responseMessage || "Failed to verify OTP");
      } else {
        toast.error("Failed to verify OTP");
      }
    } finally {
      setVerifyLoading(false);
    }
  };

  const transferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmLoading) return;
    if (!validateForm()) {
      return;
    }
    if (!isVerified) {
      toast.error("Please verify the OTP first");
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirm = async () => {
    if (confirmLoading) return;
    setConfirmLoading(true);
    try {
      const response = await axios.put(
        apiConfig.assets.confirmTransaction,
        { transactionPassword: formData.transactionPassword },
        { headers: { "Content-Type": "application/json", token: userToken } }
      );
      if (response.data.statusCode === 200) {
        setShowConfirmDialog(false);
        setShowSuccessDialog(true);
        setFormData({ address: "", amount: "", transactionPassword: "", verificationCode: "" });
        setIsVerified(false);
        setIsVerifying(false);
        setErrors({});
      } else {
        toast.error(response.data.responseMessage || "Transaction failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.responseMessage || "Transaction failed");
      } else {
        toast.error("Transaction failed");
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleQrCode = () => {
    setQrLoading(true);
    setShowQrScanner(true);
  };

  const SQUARE_SIZE = 500;

  const handleEnableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment",
          width: { ideal: SQUARE_SIZE },
          height: { ideal: SQUARE_SIZE }
        } 
      });
      stream.getTracks().forEach(track => track.stop());
      setCameraError(null);
      startScanner();
    } catch (error) {
      console.error('Camera error:', error);
      if (error instanceof Error && error.name === 'NotAllowedError') {
        setCameraError('camera-blocked');
      } else {
        setCameraError('camera-error');
      }
    }
  };

  const startScanner = async () => {
    setQrLoading(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('browser-not-supported');
        setQrLoading(false);
        return;
      }
      setTimeout(() => {
        const qrReaderElement = document.getElementById("qr-reader");
        if (!qrReaderElement) {
          console.error("QR reader element not found");
          setQrLoading(false);
          return;
        }
        const qrBoxSize = window.innerWidth < 500 ? 200 : 300;
        const newScanner = new Html5Qrcode("qr-reader");
        setScanner(newScanner);
        newScanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: qrBoxSize, height: qrBoxSize } },
          (decodedText) => {
            if (newScanner?.isScanning) {
              newScanner.stop().then(() => {
                setShowQrScanner(false);
                setScanner(null);
                setQrLoading(false);
                setFormData(prev => {
                  const updated = { ...prev, address: decodedText };
                  const newErrors: FormErrors = {};
                  if (!decodedText) {
                    newErrors.address = "Address is required";
                  } else if (decodedText.length < 30 || decodedText.length > 42) {
                    newErrors.address = "Address must be between 30 and 42 characters";
                  }
                  setErrors(prevErrs => ({ ...prevErrs, ...newErrors }));
                  return updated;
                });
              }).catch(console.error);
            }
          },
          (error) => {
            console.warn("Scanning error", error);
            setQrLoading(false);
            if (error.includes("Camera streaming not supported")) {
              setCameraError('streaming-not-supported');
            }
          }
        );
      }, 100);
    } catch (error) {
      console.error('Camera error:', error);
      setCameraError('camera-error');
      setQrLoading(false);
    }
  };

  useEffect(() => {
    if (showQrScanner) {
      startScanner();
    }
  }, [showQrScanner]);

  const handleCloseScanner = async () => {
    if (scanner?.isScanning) {
      try { await scanner.stop(); } catch (error) { console.error('Error stopping scanner:', error); }
    }
    setScanner(null);
    setShowQrScanner(false);
    setCameraError(null);
    setQrLoading(false);
  };

  const renderCameraError = () => {
    switch (cameraError) {
      case 'browser-not-supported':
        return (<div className="flex flex-col items-center gap-4 p-4">
          <p className="text-red-500 text-center">Camera access is not supported by your browser.</p>
          <p className="text-center">Please try using a modern browser like Chrome, Firefox, or Safari.</p>
        </div>);
      case 'camera-blocked':
        return (<div className="flex flex-col items-center gap-4 p-4">
          <p className="text-red-500 text-center">Camera access is blocked.</p>
          <p className="text-center">Please enable camera access in your browser settings.</p>
          <Button variant="default" onClick={handleEnableCamera} className="mt-2">Enable Camera Access</Button>
        </div>);
      case 'streaming-not-supported':
        return (<div className="flex flex-col items-center gap-4 p-4">
          <p className="text-red-500 text-center">Camera streaming is not supported.</p>
          <p className="text-center">Please try the following:</p>
          <ol className="list-decimal list-inside text-left">
            <li>Enable camera access in your browser settings</li>
            <li>Make sure no other app is using your camera</li>
            <li>Try using a different browser</li>
          </ol>
          <Button variant="default" onClick={handleEnableCamera} className="mt-2">Try Again</Button>
        </div>);
      case 'camera-error':
        return (<div className="flex flex-col items-center gap-4 p-4">
          <p className="text-red-500 text-center">Failed to access camera.</p>
          <p className="text-center">Please check your camera settings and try again.</p>
          <Button variant="default" onClick={handleEnableCamera} className="mt-2">Retry Camera Access</Button>
        </div>);
      default:
        return null;
    }
  };

  const resetForm = () =>{
    setFormData({
      address: profile?.userResult?.cryptoAddress || "",
      amount: "",
      transactionPassword: "",
      verificationCode: "",
    });
    setErrors({});
    setIsVerified(false);
    setIsVerifying(false);
    setResendTimer(0);
  }

  return (
    <>
    <Card>
    <CardHeader>
        <CardTitle className="text-white text-lg lg:text-2xl font-bold">Internal Transfer USDT</CardTitle>
        <CardDescription className="text-slate-400 font-medium">Internal Transfer USDT to your external wallet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
      <form onSubmit={transferSubmit}>
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 mt-4 gap-5 lg:gap-7 xl:gap-10">
          {/* Address */}
          <div>
            <label htmlFor="address" className="text-base font-semibold mb-2 block">Enter User&apos;s Deposit Address</label>
            <div className="flex gap-2 relative">
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                autoComplete="off"
                onChange={handleInputChange}
                placeholder="Enter Deposit Address"
                className={`h-14 text-base pr-14 ${errors.address ? 'border-red-500' : ''}`}
                required
                disabled={isVerifying}
              />
              <TooltipProvider>
                <Tooltip open={showTooltip}>
                  <TooltipTrigger asChild className="absolute right-2 top-2">
                    <Button
                      type="button"
                      variant="link"
                      size="icon"
                      className="size-10 shrink-0 cursor-pointer text-brand-2"
                      disabled={isVerifying || qrLoading}
                      onClick={handleQrCode}
                    >
                      {qrLoading ? "Loading..." : <QrCode className="size-5" />}
                      <span className="sr-only">Scan code</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Scan QR code</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>
          {/* Amount */}
          <div>
            <label htmlFor="amount" className="text-base font-semibold mb-2 block">
              Amount
            </label>
            <div className="flex gap-2 relative">
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                max={asset?.balance}
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter Amount"
                className={`h-14 text-base pr-25 ${errors.amount ? 'border-red-500' : ''}`}
                required
                disabled={isVerifying}
              />
              <Button
                type="button"
                variant="default"
                size="lg"
                className="shrink-0 cursor-pointer absolute right-2 top-2 text-sm bg-brand-2 "
                onClick={handleMaxAmount}
                disabled={isVerifying || getCodeLoading || verifyLoading || confirmLoading}
              >
                Max
              </Button>
            </div>
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            <span className="text-sm inline-block mt-3 font-semibold text-brand-5/50">
              Balance Amount : <span className="text-brand-4">{formatPrice(asset?.balance || 0)}</span>
            </span>
          </div>
          {/* Transaction Password */}
          <div>
            <label htmlFor="transactionPassword" className="text-base font-semibold mb-2 flex justify-between items-baseline flex-wrap gap-3">
              Transaction Password
              <Link
                href={routes.profile}
                className={buttonVariants({ variant: "link", size: null, textSize: "xs", className: "text-brand-2!" })}
              >
                Forgot Password ?
              </Link>
            </label>
            <div className="flex gap-2 relative">
              <Input
                name="transactionPassword"
                id="transactionPassword"
                type="password"
                autoComplete="off"
                value={formData.transactionPassword}
                onChange={handleInputChange}
                placeholder="Enter Transaction Password"
                className={`h-14 text-base ${errors.transactionPassword ? 'border-red-500' : ''}`}
                required
                disabled={isVerifying}
              />
            </div>
            {errors.transactionPassword && <p className="text-red-500 text-sm mt-1">{errors.transactionPassword}</p>}
          </div>
          {/* Verification Code */}
          <div>
            <label htmlFor="verificationCode" className="text-base font-semibold mb-2 flex justify-between items-baseline flex-wrap gap-3">
              Verification Code
              {isVerifying && !isVerified && (
                <Button 
                  variant="link"
                  size={null} 
                  className="cursor-pointer text-brand-2!"
                  textSize="xs" 
                  onClick={handleGetCode}
                  disabled={resendTimer > 0 || getCodeLoading}
                >
                  {getCodeLoading ? "Sending..." : resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend'}
                </Button>
              )}
            </label>
            <div className="flex gap-2 relative">
              <Input
                id="verificationCode"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleInputChange}
                placeholder="Enter Verification Code"
                className={`h-14 text-base pr-32 ${errors.verificationCode ? 'border-red-500' : ''}`}
                required
                readOnly={isVerified}
                disabled={isVerified}
              />
              <Button
              type="button"
              variant="default"
              size="lg"
              className="shrink-0 cursor-pointer absolute right-2 top-2 bg-brand-2"
              onClick={isVerified ? undefined : (isVerifying ? handleVerifyCode : handleGetCode)}
              disabled={isVerified || (isVerifying ? !formData.verificationCode || verifyLoading : getCodeLoading)}
            >
              {isVerified   // Show "Verified" and disable button if isVerified is true
                ? "Verified"
                : isVerifying
                  ? verifyLoading
                    ? "Verifying..."
                    : "Verify"
                  : getCodeLoading
                    ? "Sending..."
                    : "Get Code"}
            </Button>

            </div>
            {errors.verificationCode && (
              <p className="text-red-500 text-sm mt-1">{errors.verificationCode}</p>
            )}
          </div>
          <div className="xl:col-span-2">
            <Button
              type="submit"
              variant="default"
              size="xl"
              textSize="lg"
              className="w-full cursor-pointer mt-3 text-white bg-gradient-to-r from-extra-3 to-emerald-500 hover:from-emerald-500 hover:to-extra-3 hover:scale-105 hover:shadow-[0_0_20px_rgba(185,242,255,.15)]"
              disabled={!isVerified || confirmLoading}
            >
              {confirmLoading ? "Transferring..." : "Internal Transfer USDT"}
            </Button>
          </div>
        </div>
      </form>
      <div className="p-4 rounded-lg bg-extra-1/20 border border-extra-1/50 mt-10">
          <p className="text-sm text-extra-1 font-semibold mb-2">Important Notes:</p>
          <ul className="text-xs space-y-1 list-disc list-inside">
            <li>Minimum withdrawal: 20 USDT</li>
            <li>Network fee: 1 USDT</li>
            <li>Processing time: 10-30 minutes</li>
          </ul>
        </div>
      </CardContent>
    </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="[&>button]:hidden shadow-sm" onPointerDownOutside={e => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="text-white">Confirm Transfer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Address:</span>
              <span className="text-primary font-semibold">
              {formData.address.slice(0, 30)}...
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Amount:</span>
              <span className="text-primary font-semibold">
              {formatPrice(formData.amount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Transaction Fee:</span>
              <span className="text-primary font-semibold">
                {formatPrice(0)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm font-medium">Balance Amount:</span>
              <span className="text-primary font-semibold">
              {formatPrice((asset?.balance || 0) - (Number(formData.amount) || 0))}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="cursor-pointer"
              variant="outline"
              size="lg"
              onClick={() => {setShowConfirmDialog(false); resetForm()}}
              disabled={confirmLoading}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              onClick={handleConfirm}
              variant="success"
              size="lg"
              disabled={confirmLoading}
            >
              {confirmLoading ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="[&>button]:hidden shadow-sm" onPointerDownOutside={e => e.preventDefault()}>
          <DialogHeader className="mb-4">
            <DialogTitle className="text-white">Transfer Successful</DialogTitle>
            <DialogDescription>
              Your transfer has been completed successfully.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="success"
              size="lg"
              className="cursor-pointer"
              onClick={() => {
                setShowSuccessDialog(false);
                window.location.reload();
              }}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Scanner Dialog */}
      <Dialog open={showQrScanner} onOpenChange={handleCloseScanner}>
        <DialogContent className="[&>button]:hidden shadow-sm" onPointerDownOutside={e => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="text-white">Scan QR Code</DialogTitle>
            <DialogDescription className="text-brand-5/50">
              Position the QR code within the scanner frame
            </DialogDescription>
          </DialogHeader>
          {cameraError ? (
            renderCameraError()
          ) : (
            <div className="flex justify-center items-center w-full">
              <div
                id="qr-reader"
                className="max-w-[350px] w-full aspect-square bg-black rounded-lg overflow-hidden"
                style={{ margin: "0 auto" }}
              ></div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              size="lg"
              onClick={handleCloseScanner}
              disabled={qrLoading}
            >
              {qrLoading ? "Closing..." : "Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}