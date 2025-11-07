"use client";
import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import axios from "axios";
import { apiConfig } from "@/lib/api-config";
import { UserContext } from "@/lib/usercontent";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from "next/navigation";

interface GlobalAsset {
  incomeBalance: number;
  balance: number;
}

const redeemFormSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be greater than 0",
    })
    .refine((val) => {
      const num = Number(val);
      return num > 0 && num <= Number.MAX_SAFE_INTEGER;
    }, {
      message: "Amount must be a valid number",
    })
    .refine((val) => {
      const decimalPlaces = val.includes('.') ? val.split('.')[1].length : 0;
      return decimalPlaces <= 5;
    }, {
      message: "Amount can have maximum 5 decimal places",
    }),
});

type RedeemFormData = z.infer<typeof redeemFormSchema>;

export default function Redeam() {
  const userContext = useContext(UserContext);
  const userToken = userContext?.userToken;
  const { globalasset } = useContext(UserContext) || {};
  const asset = globalasset as GlobalAsset | undefined;
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);
  const [redeemedAmount, setRedeemedAmount] = React.useState(0);
  const [transactionFee, setTransactionFee] = useState({ arrival: 0 });
  const router = useRouter();

  const form = useForm<RedeemFormData>({
    resolver: zodResolver(redeemFormSchema),
    defaultValues: {
      amount: "",
    },
  });

  // Calculate arrival amount when amount changes
  useEffect(() => {
    const amount = Number(form.watch("amount")) || 0;
    const fee = 1; // Fixed fee of 1 USDT
    setTransactionFee({
      arrival: amount - fee
    });
  }, [form.watch("amount")]);

  const handleMaxAmount = () => {
    const maxAmount = asset?.incomeBalance || 0;
    form.setValue("amount", maxAmount.toFixed(5));
  };

  const onSubmit = async (values: RedeemFormData) => {
    if (!userToken) {
      toast.error("Please login to continue");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        apiConfig.assets.redeemBalance,
        { amount: Number(values.amount) },
        {
          headers: {
            "Content-Type": "application/json",
            token: userToken,
          },
        }
      );
      //console.log(response);

      if (response.data.statusCode === 200) {
        setRedeemedAmount(Number(values.amount));
        setShowSuccessDialog(true);
        form.reset();
      } else {
        toast.error(response.data.responseMessage || "Failed to redeem balance");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.responseMessage || "Failed to redeem balance");
      } else {
        toast.error("Failed to redeem balance");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* <h2 className="text-primary text-lg lg:text-2xl font-semibold">
        Redeem
      </h2>
      <Separator
        orientation="horizontal"
        className="hidden lg:inline-flex w-[86%]! mx-auto my-0"
      /> */}
      <Card>
      <CardHeader>
        <CardTitle className="text-brand-5 text-lg lg:text-2xl font-bold">Redeem</CardTitle>
        {/* <CardDescription className="text-slate-400 font-medium">Redeem USDT to your external wallet</CardDescription> */}
      </CardHeader>
      <CardContent className="space-y-4">
      <div className="flex-1 grid grid-cols-1 gap-5 lg:gap-7 xl:gap-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold mb-2 flex justify-between items-baseline flex-wrap gap-3">
                    <span>Amount</span>
                    <span className="text-xs ">Total Deduction: 1 USDT</span>
                  </FormLabel>
                    <div className="flex gap-2 relative">
                  <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        max={asset?.incomeBalance}
                        step="0.00001"
                        placeholder="Enter Amount"
                        className="h-14 text-base pr-25"
                      />
                  </FormControl>
                      <Button
                        type="button"
                        variant="default"
                        size="lg"
                        className="shrink-0 cursor-pointer absolute right-2 top-2 text-sm bg-brand-5 hover:bg-brand-4"
                        onClick={handleMaxAmount}
                      >
                        Max
                      </Button>
                    </div>
                  <FormMessage />
                  <span className="text-sm inline-block mt-3 font-semibold text-brand-5/60">
                    Arrival Amount :{" "}
                    <span className="text-brand-4">
                    {formatPrice(transactionFee.arrival <= 0 ? 0 : transactionFee.arrival, 2, false)} USDT
                      {/* {formatPrice(transactionFee.arrival || 0, false)} USDT */}
                    </span>
                  </span>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="success"
              size="xl"
              textSize="lg"
              className="w-full cursor-pointer mt-3 bg-brand-5 hover:bg-brand-4"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Redeem Now"}
            </Button>
          </form>
        </Form>
      </div>
      <div className="p-4 rounded-lg bg-brand-2/30 border border-brand-1/50 mt-10">
          <p className="text-sm text-brand-1 font-semibold mb-2">Important Notes:</p>
          <ul className="text-xs space-y-1 list-disc list-inside">
            <li>Minimum withdrawal: 20 USDT</li>
            <li>Network fee: 1 USDT</li>
            <li>Processing time: 10-30 minutes</li>
          </ul>
        </div>
      </CardContent>
    </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[425px] border-2 border-primary [&>button]:hidden" onPointerDownOutside={(event) => {event.preventDefault()}}>
          <DialogHeader className="mb-4">
            <DialogTitle className="text-primary">Redeem Successful</DialogTitle>
            <DialogDescription>
              Your redeem request has been processed successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Redeemed Amount:</span>
              <span className="text-primary font-semibold">
                {formatPrice(redeemedAmount)} USDT
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Processing Fee:</span>
              <span className="text-primary font-semibold">- 1 USDT</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm font-medium">Total Amount:</span>
              <span className="text-primary font-semibold">
                {formatPrice(redeemedAmount - 1)} USDT
              </span>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button
              variant="primary"
               className="cursor-pointer"
              size="lg"
              onClick={() => {
                setShowSuccessDialog(false);
                window.location.reload();
              }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}