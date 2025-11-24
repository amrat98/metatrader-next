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
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { apiConfig } from "@/lib/api-config";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[^\s]+$/, "Username cannot contain spaces"),
});

type FormData = z.infer<typeof formSchema>;

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: FormData) => {
    try {
      setIsLoading(true);
      setApiError("");
      const response = await axios.post(
        apiConfig.auth.getOtpChangeTransaction,
        {
          nickName: values.username
        }
      );
      if (response.data.statusCode === 200) {
        setUserId(response.data.result.userId);
        setShowSuccessDialog(true);
      } else {
        setApiError(response.data.responseMessage || "Failed to send OTP");
      }
    } catch (error) {
     // setApiError(error instanceof Error ? error.message : "Failed to send OTP. Please try again.");

      if (axios.isAxiosError(error)) {
        setApiError(error.response?.data?.responseMessage || "Failed to send OTP. Please try again.");
      } else {
        setApiError(error instanceof Error ? error.message : "Failed to send OTP. Please try again.");
      }

    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    if (userId) {
      router.push(`${routes.verify}?userID=${userId}&nickName=${form.getValues().username}`);
    } else {
      toast.error("Missing user information");
    }
  };

  return (
    <>
      <Card className="w-full text-left bg-brand-3 backdrop-blur-xl shadow-[0_0_20px_rgba(185,242,255,.15)]">
        <CardHeader className="text-center">
          <CardTitle>
            <h1 className="text-2xl">Forgot Password</h1>
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base mt-1">
            <p>Enter your username to reset your password</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="username" className="text-sm font-medium text-slate-300">Username</FormLabel>
                    <FormControl>
                      <Input
                        id="username"
                        placeholder="Enter your username"
                        {...field}
                        autoComplete="off"
                        onChange={(e) => {
                          field.onChange(e);
                          form.trigger("username");
                          setApiError("");
                        }}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                    {apiError && (
                      <p className="text-sm font-medium text-destructive mt-2">
                        {apiError}
                      </p>
                    )}
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
                {isLoading ? "Sending..." : "Reset Password"}
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
            <DialogTitle>OTP Sent Successfully</DialogTitle>
            <DialogDescription>
              Please check your email for the OTP to reset your password.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="primary"
              size="lg"
              className="cursor-pointer"
              onClick={handleSuccessDialogClose}
            >
              Okay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
