"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { apiConfig } from "@/lib/api-config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { routes } from "@/lib/routes";

const otpInputStyles = {
  slot: "sm:h-12 sm:w-12 text-lg font-semibold border-2 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20",
  group: "sm:gap-2",
  separator: "mx-2",
  container: "gap-4",
  formItem: "flex flex-col items-center mt-4",
  label: "text-sm font-medium text-slate-300 mb-4 hidden",
  message: "text-sm mt-2",
} as const;

const formSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

type FormData = z.infer<typeof formSchema>;

function VerifyFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nickName = searchParams.get("nickName");
  const userID = searchParams.get("userID");
  const [countdown, setCountdown] = useState(90);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [otpLoading, otpIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    if (!nickName || !userID) {
      router.push(routes.login);
    }
  }, [nickName, userID, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendOTP = async () => {
    if (!nickName) {
      toast.error("Missing user information");
      return;
    }

    try {
      otpIsLoading(true);
      const response = await axios.post(apiConfig.auth.getOtpChangeTransaction, {
        nickName,
      });

      if (response.data.statusCode === 200) {
        toast.success("OTP resent successfully");
        setCountdown(90);
        setIsResendDisabled(true);
      } else {
        toast.error(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to resend OTP");
    } finally {
      otpIsLoading(false);
    }
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: FormData) => {
    if (!nickName || !userID) {
      toast.error("Missing user information");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.put(apiConfig.auth.mailVerifyForgot, {
        nickName,
        otp: values.otp,
      });

      if (response.data.statusCode === 200) {
        setShowSuccessDialog(true);
      } else {
        toast.error(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to verify OTP");
      //toast.error(error.response?.data?.message || "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    if (userID && nickName) {
      router.push(`${routes.updatePassword}?userID=${userID}&nickName=${nickName}`);
    } else {
      toast.error("Missing user information");
    }
  };

  if (!nickName || !userID) {
    return null;
  }

  return (
    <>
      <Card className="w-full text-left bg-brand-3 backdrop-blur-xl shadow-[0_0_20px_rgba(185,242,255,.15)]">
        <CardHeader className="text-center">
          <CardTitle>
            <h1 className="text-2xl">Verify OTP</h1>
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base mt-1">
            <p>Enter the 6-digit code sent to your email</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className={otpInputStyles.formItem}>
                    <FormLabel className={otpInputStyles.label}>
                      OTP Code
                    </FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        autoComplete="off"
                        onChange={(value) => {
                          field.onChange(value);
                          form.trigger("otp");
                        }}
                        className={otpInputStyles.container}
                        disabled={isLoading}
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
                    <FormMessage className={otpInputStyles.message} />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className={buttonVariants({
                  variant: "primary",
                  size: "xl",
                  textSize: "xl",
                  className: "w-full cursor-pointer mt-8 transition-all duration-300 bg-gradient-to-r from-brand-1 to-brand-2 hover:from-brand-2 hover:to-brand-1 hover:scale-105 hover:shadow-[0_0_20px_rgba(185,242,255,.15)]",
                })}
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <p className="text-base mt-5">
        Didn&apos;t receive the code?{" "}
        {isResendDisabled ? (
          <>
            <span className="text-muted-foreground">Resend OTP</span>
            <span className="text-sm text-muted-foreground block mt-2">
              Resend available in {countdown} seconds
            </span>
          </>
        ) : (
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleResendOTP();
            }}
            className={buttonVariants({
              variant: "link",
              size: null,
              textSize: null,
            })}
          >
            {otpLoading ? "Sending..." : "Resend OTP"}
          </Link>
        )}
      </p>
      <p className="text-base mt-5">
        Remember your password?{" "}
        <Link
          href={routes.login}
          className={buttonVariants({
            variant: "link",
            size: null,
            textSize: null,
          })}
        >
          Sign In
        </Link>
      </p>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="[&>button]:hidden border-2 border-primary" onPointerDownOutside={(event) => {event.preventDefault()}}>
          <DialogHeader className="mb-4">
            <DialogTitle>Success</DialogTitle>
            <DialogDescription>
              OTP verified successfully. You can now update your password.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
          <Button
            onClick={handleSuccessDialogClose}
            variant="primary"
            size="lg"
          >
            Okay
          </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function VerifyForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyFormContent />
    </Suspense>
  );
}
