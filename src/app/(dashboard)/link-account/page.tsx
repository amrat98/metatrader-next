"use client";

import { useState, useContext } from "react";
import axios from "axios";
import { apiConfig } from "@/lib/api-config";
import { UserContext } from "@/lib/usercontent";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

const accountFormSchema = z.object({
  fxBroker: z.string().min(1, "Select any one option"),
  fxAccountNumber: z.string().min(1, "Account Number required"),
  fxAccountIB: z.string().min(1, "IB Number required"),
});

type AccountFormData = z.infer<typeof accountFormSchema>;

export default function AccountLink() {
  const { profile, userRank, setProfile, userToken } =
    useContext(UserContext) || {};
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const accountForm = useForm<AccountFormData>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      fxBroker: "MT4",
      fxAccountNumber: "",
      fxAccountIB: "",
    },
    mode: "onChange",
  });

  const selectedBroker = accountForm.watch("fxBroker") || "MT4";

  const onAccount = async (values: AccountFormData) => {
    setFormError("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 5000)); // Delay 3 sec

    try {
      const response = await axios.put(
        apiConfig.profile.updateProfile,
        {
            fxBroker: values.fxBroker,
            fxAccountNumber: values.fxAccountNumber,
            fxAccountIB: values.fxAccountIB,
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: userToken || "",
          },
        }
      );

      if (response.data.statusCode === 200) {
        toast.success("Account linked successfully");
        setShowSuccessDialog(true);
      } else {
        toast.error(response.data.message || "Failed to link account");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.responseMessage || "Failed to link account");
      } else {
        toast.error("Failed to link account");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-5 p-4">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold mb-2">
            <span className="meta-text">Link Accounts</span>
          </h1>
        </div>

        <div className="flex-1 pb-5">
          <div className="border-2 border-primary p-5 py-8 lg:p-10 bg-card rounded-lg lg:rounded-2xl mt-6">

            {profile?.userResult?.fxAccountStatus === "APPROVED" && (
              <>
                <div className="p-4 py-10 text-xl font-medium rounded-xl transition-all duration-300 border shadow-sm  meta-border meta-shine hover:meta-glow flex flex-col gap-5 items-center">
                  <h4 className="text-primary text-xl font-semibold">Fx Account Details</h4>
                  <div className="grid gap-6 xl:grid-cols-2 w-full max-w-lg bg-gradient-to-br from-brand-1 to-brand-2 p-6 border-2 border-brand-1 rounded-lg">
                      <div className="text-extra-5">
                        <p className="text-sm">Fx Account Broker</p>
                        <p className="font-semibold">
                          {profile?.userResult?.fxBroker}
                        </p>
                      </div>
                      <div className="text-extra-5">
                        <p className="text-sm">Fx Account Number</p>
                        <p className="font-semibold">
                          {profile?.userResult?.fxAccountNumber}
                        </p>
                      </div>
                      <div className="text-extra-5">
                        <p className="text-sm">Fx Account Balance</p>
                        <p className="font-semibold">
                          {profile?.userResult?.fxAccountBalance}
                        </p>
                      </div>
                      <div className="text-extra-5">
                        <p className="text-sm">Fx Account IB</p>
                        <p className="font-semibold">
                          {profile?.userResult?.fxAccountIB}
                        </p>
                      </div>
                  </div>
                </div>
              </>
            )}
          {profile?.userResult?.fxAccountStatus === "WAITING" && (
            <>
            <div className="p-4 py-10 text-xl font-medium rounded-xl transition-all duration-300 border shadow-sm  meta-border meta-shine hover:meta-glow flex flex-col gap-10 items-center">
            <h4 className="text-primary text-xl font-semibold">Waiting for Approval</h4>
              <p>Admin side verification is pending...</p>
            </div>
            </>
          )}

          {profile?.userResult?.fxAccountStatus === "PENDING" && (
            <Form {...accountForm}>
              <form
                onSubmit={accountForm.handleSubmit(onAccount)}
                className="w-full"
              >
                {formError && (
                  <div className="text-sm text-red-500 mb-4">{formError}</div>
                )}
                  <h4 className="text-primary text-lg font-semibold">Select Broker</h4>
                  <FormField
                    control={accountForm.control}
                    name="fxBroker"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel className="hidden">Broker</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              setFormError("");
                            }}
                            value={field.value}
                            defaultValue="MT4"
                            name="fxBroker"
                            className="flex gap-5 mt-4 flex-wrap whitespace-nowrap flex-col sm:flex-row"
                          >
                            <div className="flex items-center space-x-2 relative flex-1">
                            <Label
                                htmlFor="MT4"
                                className="text-lg lg:text-xl font-semibold cursor-pointer justify-center py-2 px-4 w-full bg-brand-1/20 rounded-md border border-brand-1/50 has-[[aria-checked=true]]:bg-primary has-[[aria-checked=true]]:text-primary-foreground"
                              >
                              <RadioGroupItem
                                value="MT4"
                                id="MT4"
                                className="border-brand-2 size-5 border-2 text-brand-2 sr-only"
                              />
                                MT4
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 relative flex-1">
                            <Label
                                htmlFor="MT5"
                                className="text-lg lg:text-xl font-semibold cursor-pointer justify-center py-2 px-4 w-full bg-brand-1/20 rounded-md border border-brand-1/50 has-[[aria-checked=true]]:bg-primary has-[[aria-checked=true]]:text-primary-foreground"
                              >
                              <RadioGroupItem
                                value="MT5"
                                id="MT5"
                                className="border-brand-2 size-5 border-2 text-brand-2 sr-only"
                              />
                                MT5
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 relative flex-1">
                            <Label
                                htmlFor="Zettaforex"
                                className="text-lg lg:text-xl font-semibold cursor-pointer justify-center py-2 px-4 w-full bg-brand-1/20 rounded-md border border-brand-1/50 has-[[aria-checked=true]]:bg-primary has-[[aria-checked=true]]:text-primary-foreground"
                              >
                              <RadioGroupItem
                                value="Zetta Forex"
                                id="Zettaforex"
                                className="border-brand-2 size-5 border-2 text-brand-2 sr-only"
                              />
                                Zetta Forex
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                {showForm ? (
                  <>
                  <FormField
                    control={accountForm.control}
                    name="fxAccountNumber"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel>FX Account Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            disabled={isLoading}
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            onChange={(e) => {
                              field.onChange(e)
                              accountForm.trigger("fxAccountNumber")
                              setFormError("")
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={accountForm.control}
                    name="fxAccountIB"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel>IB Account</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            disabled={isLoading}
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            onChange={(e) => {
                              field.onChange(e)
                              accountForm.trigger("fxAccountIB")
                              setFormError("")
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <div className="flex gap-2 justify-end">
                  <Button
                    type="reset"
                    variant="outline"
                    size="lg"
                    onClick={()=> setShowForm(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    variant="primary"
                    size="lg"
                  >
                    {isLoading ? "Sending..." : "Submit"}
                  </Button>
                </div>
                  </>
                ):(
                  <>
                  <div className="p-4 py-10 mt-20 text-xl font-medium rounded-xl transition-all duration-300 border shadow-sm  meta-border meta-shine hover:meta-glow flex flex-col gap-10 items-center">
                    <Button size="lg" type="button" variant="primary" className="text-xl"
                    onClick={()=> setShowForm(true)}
                    >Link your Account</Button>
                    <span>Don't have the account?{" "}

                    {selectedBroker === 'MT4' && <Link target="_blank" href="https://www.metatrader4.com/en" className="text-primary underline underline-offset-3">Create Account</Link>}
                    {selectedBroker === 'MT5' && <Link target="_blank" href="#" className="text-primary underline underline-offset-3">Create Account</Link>}
                    {selectedBroker === 'Zetta Forex' && <Link target="_blank" href="#" className="text-primary underline underline-offset-3">Create Account</Link>}
                      </span>
                  </div>
                  </>
                )}
              </form>
            </Form>
          )}
          </div>
        </div>
      </div>

      <Dialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
      >
        <DialogContent
          className="sm:max-w-[425px] [&>button]:hidden"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-primary">Account Linked</DialogTitle>
            <DialogDescription>
              Your account has been linked successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button
              variant="primary"
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
