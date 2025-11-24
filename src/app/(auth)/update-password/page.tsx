"use client";

import React, { useState, Suspense, useEffect } from "react";
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
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Eye, EyeOff } from "lucide-react";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      )
      .regex(/^[^\s]+$/, "Password cannot contain spaces"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

function UpdatePasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nickName = searchParams.get("nickName");
  const userID = searchParams.get("userID");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!nickName || !userID) {
      router.push(routes.login);
    }
  }, [nickName, userID, router]);

  if (!nickName || !userID) {
    return null;
  }

  const onSubmit = async (values: FormData) => {
    if (!userID || !nickName) {
      toast.error("Missing user information");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.put(apiConfig.auth.resetPassword, {
        userId: userID,
        //nickName,
        password: values.password,
        confirmPassword: values.confirmPassword,
        otpVerificationStatus: true,
      });
      //console.log(response);

      if (response.data.result) {
        setShowSuccessDialog(true);
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      //toast.error(error instanceof Error ? error.message : "Failed to reset password");
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.responseMessage || "Failed to reset password");
      } else {
        toast.error(error instanceof Error ? error.message : "Failed to reset password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    router.push(routes.login);
  };

  return (
    <>
      <Card className="w-full text-left bg-brand-3 backdrop-blur-xl shadow-[0_0_20px_rgba(185,242,255,.15)]">
        <CardHeader className="text-center">
          <CardTitle>
            <h1 className="text-2xl">Update Password</h1>
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base mt-1">
            <p>Enter your new password</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-300">New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        {...field}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        onChange={(e) => {
                          field.onChange(e);
                          form.trigger("password");
                        }}
                        disabled={isLoading}
                      />
                      <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-300">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        {...field}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        onChange={(e) => {
                          field.onChange(e);
                          form.trigger("confirmPassword");
                        }}
                        disabled={isLoading}
                      />
                      <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
  </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className={buttonVariants({
                  variant: "primary",
                  size: "xl",
                  textSize: "xl",
                  className: "w-full cursor-pointer transition-all duration-300 bg-gradient-to-r from-brand-1 to-brand-2 hover:from-brand-2 hover:to-brand-1 hover:scale-105 hover:shadow-[0_0_20px_rgba(185,242,255,.15)]",
                })}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

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
              Your password has been updated successfully. You can now login with your new password.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={handleSuccessDialogClose}
              variant="primary"
              size="lg"
            >
              Go to Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function UpdatePasswordForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdatePasswordFormContent />
    </Suspense>
  );
}
