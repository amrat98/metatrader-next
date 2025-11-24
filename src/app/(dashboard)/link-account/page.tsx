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
import Image from "next/image";

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
                                className="text-lg lg:text-xl font-semibold cursor-pointer justify-center py-3 px-4 w-full bg-white rounded-md border border-brand-1/50 has-[[aria-checked=true]]:bg-gradient-to-r from-brand-1 to-brand-2 has-[[aria-checked=true]]:text-primary-foreground"
                              >
                              <RadioGroupItem
                                value="MT4"
                                id="MT4"
                                className="border-brand-2 size-5 border-2 text-brand-2 sr-only"
                              />
                                {/* MT4 */}
                                <Image
                                    src={'/m4markets.png'}
                                    alt="Deposit Address QR"
                                    width={150}
                                    height={30}
                                    className="w-auto h-[30px]"
                                  />
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 relative flex-1">
                            <Label
                                htmlFor="Vantage"
                                className="text-lg lg:text-xl font-semibold cursor-pointer justify-center py-3 px-4 w-full bg-white rounded-md border border-brand-1/50 has-[[aria-checked=true]]:bg-gradient-to-r from-brand-2 to-brand-1 has-[[aria-checked=true]]:text-primary-foreground"
                              >
                              <RadioGroupItem
                                value="Vantage"
                                id="Vantage"
                                className="border-brand-2 size-5 border-2 text-brand-2 sr-only"
                              />
                                {/* MT5 */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="121.428" height="28.022" viewBox="0 0 121.428 28.022" className="w-auto h-[30px]"><g transform="translate(60.714 14.011)"><g transform="translate(-60.714 -14.011)"><g transform="translate(32.93 3.203)"><path d="M165.591,29.006h-2.074a.372.372,0,0,0-.349.244l-3.3,9.025-3.325-9.026a.372.372,0,0,0-.349-.243h-2.075a.372.372,0,0,0-.346.507l4.467,11.453a.372.372,0,0,0,.346.237h2.541a.372.372,0,0,0,.346-.237l4.467-11.453A.372.372,0,0,0,165.591,29.006Z" transform="translate(-153.745 -25.996)" fill="#034854"/><g transform="translate(12.255)"><path d="M286.1,27.525a4.2,4.2,0,0,0-3.781,1.878V28.214a.372.372,0,0,0-.372-.372h-1.891a.372.372,0,0,0-.372.372V39.667a.372.372,0,0,0,.372.372h1.891a.372.372,0,0,0,.372-.372V33.5c0-2.488,1.366-3.513,3.1-3.513a2.542,2.542,0,0,1,2.732,2.83v6.849a.372.372,0,0,0,.372.372h1.891a.372.372,0,0,0,.372-.372V32.55C290.784,29.379,288.832,27.525,286.1,27.525Z" transform="translate(-264.965 -24.832)" fill="#034854"/><path d="M514.717,27.525a6.221,6.221,0,0,0-6.44,6.415,6.676,6.676,0,0,0,11.732,4.094.37.37,0,0,0-.109-.545l-1.533-.9a.37.37,0,0,0-.47.08,3.8,3.8,0,0,1-2.96,1.267,3.666,3.666,0,0,1-3.9-2.878h9.383a.372.372,0,0,0,.369-.327,6.505,6.505,0,0,0,.054-.771A6.155,6.155,0,0,0,514.717,27.525Zm-3.708,5.391a3.545,3.545,0,0,1,3.683-3,3.394,3.394,0,0,1,3.488,3Z" transform="translate(-444.596 -24.832)" fill="#034854"/><path d="M223.114,27.842h-1.891a.372.372,0,0,0-.372.372V28.5a6.522,6.522,0,0,0-3.453-.971,6.415,6.415,0,1,0,0,12.831,6.5,6.5,0,0,0,3.453-.977v.288a.372.372,0,0,0,.372.372h1.891a.372.372,0,0,0,.372-.372V28.214A.372.372,0,0,0,223.114,27.842Zm-2.263,7.774a3.854,3.854,0,1,1,0-3.352Z" transform="translate(-210.959 -24.832)" fill="#034854"/><path d="M387.574,27.842h-1.891a.372.372,0,0,0-.372.372V28.5h0a6.522,6.522,0,0,0-3.453-.971,6.415,6.415,0,1,0,0,12.831,6.5,6.5,0,0,0,3.453-.977h0v.288a.372.372,0,0,0,.372.372h1.891a.372.372,0,0,0,.372-.372V28.214A.372.372,0,0,0,387.574,27.842Zm-2.263,7.774a3.854,3.854,0,1,1,0-3.352h0v3.352Z" transform="translate(-340.194 -24.832)" fill="#034854"/><path d="M454,27.842H452.11a.372.372,0,0,0-.372.372v.281a6.522,6.522,0,0,0-3.451-.97,6.415,6.415,0,1,0,0,12.831,6.5,6.5,0,0,0,3.451-.975v.131c0,2.164-1.393,3.432-3.706,3.432-1.947,0-2.887-.685-3.455-1.6a.371.371,0,0,0-.5-.125l-1.669.969a.374.374,0,0,0-.126.523c1.1,1.768,3.125,2.672,5.7,2.672,3.258,0,6.392-1.865,6.392-5.87v-11.3A.372.372,0,0,0,454,27.842Zm-2.265,7.778a3.854,3.854,0,1,1,0-3.36Z" transform="translate(-392.395 -24.832)" fill="#034854"/><path d="M348.237,27.972a.372.372,0,0,0-.335-.178c-1.913.087-3.525.064-3.525-1.44V21.843l5.179-3.88h-5.179V15.325a.372.372,0,0,0-.372-.372h-1.891a.372.372,0,0,0-.372.372v11.03c0,3.171,2.212,4.293,6.261,3.805.288-.028.6-.08.9-.139a.371.371,0,0,0,.244-.557Z" transform="translate(-313.73 -14.953)" fill="#034854"/></g></g><path d="M0,0H7.508L18.9,21.1l-3.743,6.922Z" fill="#034854"/><path d="M48.094,0H68.1L58.144,18.409V6.213Z" transform="translate(-37.793)" fill="#e35728"/></g></g></svg>
                              </Label>
                            </div>
                            {/* <div className="flex items-center space-x-2 relative flex-1">
                            <Label
                                htmlFor="Zettaforex"
                                className="text-lg lg:text-xl font-semibold cursor-pointer justify-center py-3 px-4 w-full bg-brand-1/20 rounded-md border border-brand-1/50 has-[[aria-checked=true]]:bg-primary has-[[aria-checked=true]]:text-primary-foreground"
                              >
                              <RadioGroupItem
                                value="Zetta Forex"
                                id="Zettaforex"
                                className="border-brand-2 size-5 border-2 text-brand-2 sr-only"
                              />
                                Zetta Forex
                              </Label>
                            </div> */}
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

                    {selectedBroker === 'MT4' && <Link target="_blank" href="https://secure.m4markets.com/links/go/6758" className="text-primary underline underline-offset-3">Create Account</Link>}
                    {selectedBroker === 'Vantage' && <Link target="_blank" href="https://www.vantagemarkets.com/forex-trading/forex-trading-account/?affid=20790362" className="text-primary underline underline-offset-3">Create Account</Link>}
                    {/* {selectedBroker === 'Zetta Forex' && <Link target="_blank" href="#" className="text-primary underline underline-offset-3">Create Account</Link>} */}
                      </span>

                    <span className="text-base">Need any help to create any account? <Link target="_blank" href="#" className="text-primary underline underline-offset-3">Contact us</Link></span>

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
