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

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import Link from "next/link";
import { routes } from "@/lib/routes";
import { Button, buttonVariants } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect, useContext } from "react";
import { authService } from "@/lib/services/auth.service";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { Suspense } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    ),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  nickName: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[^\s]+$/, "Username cannot contain spaces"),
  mobileNumber: z
    .string()
    .min(6, "Phone number is required")
    // .optional()
    .refine(val => !val || /^[0-9]{7,12}$/.test(val), {
      message: "Please enter a valid phone number (7-12 digits, no spaces or hyphens)"
    }),
  invitationCode: z
    .string()
    .min(3, "Referral code must be at least 3 characters"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type FormData = z.infer<typeof formSchema>;

function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string>("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(90);
  const [isVerified, setIsVerified] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      nickName: "",
      mobileNumber: "",
      invitationCode: refCode || "",
      terms: false,
    },
    mode: "onChange",
  });

  const otpForm = useForm<{ otp: string }>({
    resolver: zodResolver(z.object({
      otp: z.string().length(6, "OTP must be 6 digits")
    })),
    defaultValues: {
      otp: ""
    }
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResendDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
      setCountdown(60);
    }
    return () => clearInterval(timer);
  }, [isResendDisabled, countdown]);

  const onSubmit = async (values: FormData) => {
    if (!isVerified) {
      try {
        setIsLoading(true);
        setRegisterError("");

        const response = await authService.signup({
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          nickName: values.nickName,
          mobileNumber: values.mobileNumber || '',
          invitationCode: values.invitationCode,
        });

        if (response?.responseMessage?.includes("OTP sent to your email")) {
          setEmail(values.email);
          setToken(response.result?.token || "");
          setShowOtpDialog(true);
          setIsResendDisabled(true);
          setCountdown(90);
          //setIsLoading(false);
        } else if (response?.responseMessage?.includes("This email already exists")) {
          setRegisterError("This email is already registered. Please use a different email or try logging in.");
          //setIsLoading(false);
        } else {
          setRegisterError(response?.responseMessage || "Registration failed. Please try again.");
          //setIsLoading(false);
        }
      } catch (error) {
        setRegisterError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOtpSubmit = async (values: { otp: string }) => {
    try {
      setIsOtpLoading(true);
      const response = await authService.otpVerify({
        email,
        otp: values.otp,
        token
      });

      if (response?.statusCode === 200) {
        setIsVerified(true);
        setShowOtpDialog(false);
        setShowSuccessDialog(true);
        otpForm.reset();
      } else {
        otpForm.setError("otp", {
          message: response?.responseMessage || "OTP verification failed. Please try again."
        });
      }
    } catch (error) {
      otpForm.setError("otp", {
        message: error instanceof Error ? error.message : "OTP verification failed. Please try again."
      });
    } finally {
      setIsOtpLoading(false);
      setResendSuccess(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsOtpLoading(true);
      setResendSuccess(false);
      const response = await authService.resendOtp({
        email,
        token
      });

      if (response?.responseMessage === "OTP sent Successfully!") {
        setToken(response.result?.token || "");
        setIsResendDisabled(true);
        setResendSuccess(true);
        otpForm.reset();
      } else {
        otpForm.setError("otp", {
          message: response?.responseMessage || "Failed to resend OTP. Please try again."
        });
      }
    } catch (error) {
      otpForm.setError("otp", {
        message: error instanceof Error ? error.message : "Failed to resend OTP. Please try again."
      });
    } finally {
      setIsOtpLoading(false);
      setResendSuccess(false);
    }
  };

  return (
    <>
      <Card className="w-full text-left backdrop-blur-md bg-card/60">
        <CardHeader className="text-center">
          <CardTitle>
            <h1 className="text-2xl">Sign Up</h1>
          </CardTitle>
          <CardDescription className="text-foreground text-base mt-1">
            <p>Create your account on Metatrader</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-col-1 md:grid-cols-2 gap-6 items-start">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          {...field}
                          disabled={isLoading}
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck="false"
                          onChange={(e) => {
                            field.onChange(e);
                            form.trigger("firstName");
                            setRegisterError("");
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          {...field}
                          disabled={isLoading}
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck="false"
                          onChange={(e) => {
                            field.onChange(e);
                            form.trigger("lastName");
                            setRegisterError("");
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="nickName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="johndoe"
                        {...field}
                        disabled={isLoading}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        onChange={(e) => {
                          field.onChange(e);
                          form.trigger("nickName");
                          setRegisterError("");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                        disabled={isLoading}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        onChange={(e) => {
                          field.onChange(e);
                          form.trigger("email");
                          setRegisterError("");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="1234567890"
                        {...field}
                        disabled={isLoading}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        onChange={(e) => {
                          field.onChange(e);
                          form.trigger("mobileNumber");
                          setRegisterError("");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="invitationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referral Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter referral code"
                        {...field}
                        disabled={isLoading}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        onChange={(e) => {
                          field.onChange(e);
                          form.trigger("invitationCode");
                          setRegisterError("");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        className="mt-1"
                        checked={field.value}
                        disabled={isLoading}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          form.trigger("terms");
                          setRegisterError("");
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="inline-block leading-normal text-sm">
                        I Accept The{" "}
                        <Link href={routes.terms}
                          className="underline underline-offset-2"
                        >
                          Terms and Condition
                        </Link>
                        ,{" "}
                        <Link href={routes.privacy}
                          className="underline underline-offset-2"
                        >
                          Privacy Policy</Link>
                        {" "}
                        and{" "}
                        <Link href={routes.userAgreement}
                          className="underline underline-offset-2"
                        >
                          User Service Agreement</Link>
                        {" "}
                        of Metatrader
                      </FormLabel>
                      {/* <FormMessage /> */}
                    </div>
                  </FormItem>
                )}
              />

              {registerError && (
                <div className="text-base text-destructive mt-2">
                  {registerError}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || isVerified}
                className={buttonVariants({
                  variant: "primary",
                  size: "xl",
                  textSize: "xl",
                  className: "w-full cursor-pointer",
                })}
              >
                {isLoading ? "Creating Account..." : isVerified ? "Registration Complete" : "Create Account"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <p className="text-base mt-5">
        Already have an account?{" "}
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

      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="sm:max-w-[425px] [&>button]:hidden" onPointerDownOutside={(event) => {event.preventDefault()}}>
          <DialogHeader className="mb-4">
            <DialogTitle>Verify OTP</DialogTitle>
            <DialogDescription>
              Please enter the 6-digit OTP sent to your email.
            </DialogDescription>
          </DialogHeader>
          <Form {...otpForm}>
          {resendSuccess && (
              <p className="text-sm text-green-500 mt-2 text-center">
                OTP sent Successfully!
              </p>
            )}
            <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-6">
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          otpForm.trigger("otp");
                        }}
                        className="gap-2"
                        disabled={isOtpLoading}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    setShowOtpDialog(false);
                    otpForm.reset();
                    setRegisterError("");
                    setResendSuccess(false);
                  }}
                  disabled={isOtpLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isOtpLoading}
                >
                  {isOtpLoading ? "Verifying..." : "Verify OTP"}
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Didn't receive the code?{" "}
              {isResendDisabled ? (
                <span className="text-muted-foreground">
                  Resend available in {countdown} seconds
                </span>
              ) : (
                <Button
                  variant="link"
                  onClick={handleResendOTP}
                  disabled={isOtpLoading}
                  className="p-0 h-auto"
                >
                  {isOtpLoading ? "Sending..." : "Resend OTP"}
                </Button>
              )}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[425px] [&>button]:hidden border-primary border-2" onPointerDownOutside={(event) => {event.preventDefault()}}>
          <DialogHeader>
            <DialogTitle className="text-center">Registration Successful!</DialogTitle>
            <DialogDescription className="text-base mt-2 text-center">
            Congratulations! Your account has been created successfully. <br /><br />
            Please check your email for your login credentials. You can use these details to access your account.
            </DialogDescription>
          </DialogHeader>
          <div className="flex mt-4 justify-center">
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                router.push(routes.login);
              }}
              className={buttonVariants({
                variant: "primary",
                size: "lg",
                textSize: "default",
                className: "cursor-pointer"
              })}
            >
              Go to Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
