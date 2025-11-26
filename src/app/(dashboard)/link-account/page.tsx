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
                                htmlFor="vantage"
                                className="text-lg lg:text-xl font-semibold cursor-pointer justify-center py-3 px-4 w-full bg-white rounded-md border border-brand-1/50 has-[[aria-checked=true]]:bg-gradient-to-r from-brand-2 to-brand-1 has-[[aria-checked=true]]:text-primary-foreground"
                              >
                              <RadioGroupItem
                                value="vantage"
                                id="vantage"
                                className="border-brand-2 size-5 border-2 text-brand-2 sr-only"
                              />
                                {/* MT5 */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="121.428" height="28.022" viewBox="0 0 121.428 28.022" className="w-auto h-[30px]"><g transform="translate(60.714 14.011)"><g transform="translate(-60.714 -14.011)"><g transform="translate(32.93 3.203)"><path d="M165.591,29.006h-2.074a.372.372,0,0,0-.349.244l-3.3,9.025-3.325-9.026a.372.372,0,0,0-.349-.243h-2.075a.372.372,0,0,0-.346.507l4.467,11.453a.372.372,0,0,0,.346.237h2.541a.372.372,0,0,0,.346-.237l4.467-11.453A.372.372,0,0,0,165.591,29.006Z" transform="translate(-153.745 -25.996)" fill="#034854"/><g transform="translate(12.255)"><path d="M286.1,27.525a4.2,4.2,0,0,0-3.781,1.878V28.214a.372.372,0,0,0-.372-.372h-1.891a.372.372,0,0,0-.372.372V39.667a.372.372,0,0,0,.372.372h1.891a.372.372,0,0,0,.372-.372V33.5c0-2.488,1.366-3.513,3.1-3.513a2.542,2.542,0,0,1,2.732,2.83v6.849a.372.372,0,0,0,.372.372h1.891a.372.372,0,0,0,.372-.372V32.55C290.784,29.379,288.832,27.525,286.1,27.525Z" transform="translate(-264.965 -24.832)" fill="#034854"/><path d="M514.717,27.525a6.221,6.221,0,0,0-6.44,6.415,6.676,6.676,0,0,0,11.732,4.094.37.37,0,0,0-.109-.545l-1.533-.9a.37.37,0,0,0-.47.08,3.8,3.8,0,0,1-2.96,1.267,3.666,3.666,0,0,1-3.9-2.878h9.383a.372.372,0,0,0,.369-.327,6.505,6.505,0,0,0,.054-.771A6.155,6.155,0,0,0,514.717,27.525Zm-3.708,5.391a3.545,3.545,0,0,1,3.683-3,3.394,3.394,0,0,1,3.488,3Z" transform="translate(-444.596 -24.832)" fill="#034854"/><path d="M223.114,27.842h-1.891a.372.372,0,0,0-.372.372V28.5a6.522,6.522,0,0,0-3.453-.971,6.415,6.415,0,1,0,0,12.831,6.5,6.5,0,0,0,3.453-.977v.288a.372.372,0,0,0,.372.372h1.891a.372.372,0,0,0,.372-.372V28.214A.372.372,0,0,0,223.114,27.842Zm-2.263,7.774a3.854,3.854,0,1,1,0-3.352Z" transform="translate(-210.959 -24.832)" fill="#034854"/><path d="M387.574,27.842h-1.891a.372.372,0,0,0-.372.372V28.5h0a6.522,6.522,0,0,0-3.453-.971,6.415,6.415,0,1,0,0,12.831,6.5,6.5,0,0,0,3.453-.977h0v.288a.372.372,0,0,0,.372.372h1.891a.372.372,0,0,0,.372-.372V28.214A.372.372,0,0,0,387.574,27.842Zm-2.263,7.774a3.854,3.854,0,1,1,0-3.352h0v3.352Z" transform="translate(-340.194 -24.832)" fill="#034854"/><path d="M454,27.842H452.11a.372.372,0,0,0-.372.372v.281a6.522,6.522,0,0,0-3.451-.97,6.415,6.415,0,1,0,0,12.831,6.5,6.5,0,0,0,3.451-.975v.131c0,2.164-1.393,3.432-3.706,3.432-1.947,0-2.887-.685-3.455-1.6a.371.371,0,0,0-.5-.125l-1.669.969a.374.374,0,0,0-.126.523c1.1,1.768,3.125,2.672,5.7,2.672,3.258,0,6.392-1.865,6.392-5.87v-11.3A.372.372,0,0,0,454,27.842Zm-2.265,7.778a3.854,3.854,0,1,1,0-3.36Z" transform="translate(-392.395 -24.832)" fill="#034854"/><path d="M348.237,27.972a.372.372,0,0,0-.335-.178c-1.913.087-3.525.064-3.525-1.44V21.843l5.179-3.88h-5.179V15.325a.372.372,0,0,0-.372-.372h-1.891a.372.372,0,0,0-.372.372v11.03c0,3.171,2.212,4.293,6.261,3.805.288-.028.6-.08.9-.139a.371.371,0,0,0,.244-.557Z" transform="translate(-313.73 -14.953)" fill="#034854"/></g></g><path d="M0,0H7.508L18.9,21.1l-3.743,6.922Z" fill="#034854"/><path d="M48.094,0H68.1L58.144,18.409V6.213Z" transform="translate(-37.793)" fill="#e35728"/></g></g></svg>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 relative flex-1">
                            <Label
                                htmlFor="orontrade"
                                className="text-lg lg:text-xl font-semibold cursor-pointer justify-center py-3 px-4 w-full bg-white rounded-md border border-brand-1/50 has-[[aria-checked=true]]:bg-gradient-to-r from-brand-2 to-brand-1 has-[[aria-checked=true]]:text-primary-foreground"
                              >
                              <RadioGroupItem
                                value="orontrade"
                                id="orontrade"
                                className="border-brand-2 size-5 border-2 text-brand-2 sr-only"
                              />
                                {/* MT5 */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="365" height="75" viewBox="0 0 365 75" fill="none" className="w-auto h-[30px]">
<g>
<path d="M117.324 69.855C112.65 69.855 108.347 69.0855 104.414 67.5466C100.482 66.0076 97.062 63.8702 94.155 61.1344C91.248 58.3415 88.997 55.0927 87.401 51.3878C85.8048 47.626 85.0068 43.5222 85.0068 39.0764C85.0068 34.6306 85.8048 30.5553 87.401 26.8505C88.997 23.0887 91.248 19.8398 94.155 17.104C97.062 14.3111 100.482 12.1452 104.414 10.6063C108.347 9.06731 112.622 8.29791 117.239 8.29791C121.913 8.29791 126.187 9.06731 130.063 10.6063C133.996 12.1452 137.416 14.3111 140.323 17.104C143.23 19.8398 145.481 23.0887 147.077 26.8505C148.673 30.5553 149.471 34.6306 149.471 39.0764C149.471 43.5222 148.673 47.626 147.077 51.3878C145.481 55.1497 143.23 58.3985 140.323 61.1344C137.416 63.8702 133.996 66.0076 130.063 67.5466C126.187 69.0855 121.941 69.855 117.324 69.855ZM117.239 60.1084C120.26 60.1084 123.052 59.5954 125.617 58.5695C128.182 57.5435 130.405 56.0901 132.286 54.2092C134.167 52.2713 135.62 50.0484 136.646 47.5405C137.729 44.9756 138.271 42.1543 138.271 39.0764C138.271 35.9986 137.729 33.2057 136.646 30.6978C135.62 28.1329 134.167 25.91 132.286 24.0291C130.405 22.0912 128.182 20.6093 125.617 19.5833C123.052 18.5574 120.26 18.0444 117.239 18.0444C114.218 18.0444 111.425 18.5574 108.86 19.5833C106.352 20.6093 104.129 22.0912 102.191 24.0291C100.311 25.91 98.829 28.1329 97.746 30.6978C96.72 33.2057 96.207 35.9986 96.207 39.0764C96.207 42.0973 96.72 44.8901 97.746 47.455C98.829 50.0199 100.311 52.2713 102.191 54.2092C104.072 56.0901 106.295 57.5435 108.86 58.5695C111.425 59.5954 114.218 60.1084 117.239 60.1084ZM161.252 69V9.15281H185.875C191.175 9.15281 195.707 10.0078 199.468 11.7177C203.287 13.4276 206.223 15.8785 208.275 19.0704C210.326 22.2622 211.352 26.0525 211.352 30.4413C211.352 34.8301 210.326 38.6204 208.275 41.8123C206.223 44.9471 203.287 47.3695 199.468 49.0794C195.707 50.7324 191.175 51.5588 185.875 51.5588H167.408L172.366 46.5146V69H161.252ZM200.409 69L185.276 47.284H197.16L212.378 69H200.409ZM172.366 47.7115L167.408 42.4108H185.362C190.263 42.4108 193.94 41.3563 196.391 39.2474C198.899 37.1385 200.152 34.2032 200.152 30.4413C200.152 26.6225 198.899 23.6872 196.391 21.6353C193.94 19.5833 190.263 18.5574 185.362 18.5574H167.408L172.366 13.0857V47.7115ZM251.83 69.855C247.156 69.855 242.853 69.0855 238.92 67.5466C234.987 66.0076 231.568 63.8702 228.661 61.1344C225.754 58.3415 223.502 55.0927 221.906 51.3878C220.311 47.626 219.513 43.5222 219.513 39.0764C219.513 34.6306 220.311 30.5553 221.906 26.8505C223.502 23.0887 225.754 19.8398 228.661 17.104C231.568 14.3111 234.987 12.1452 238.92 10.6063C242.853 9.06731 247.128 8.29791 251.745 8.29791C256.418 8.29791 260.693 9.06731 264.569 10.6063C268.502 12.1452 271.922 14.3111 274.828 17.104C277.735 19.8398 279.987 23.0887 281.583 26.8505C283.179 30.5553 283.977 34.6306 283.977 39.0764C283.977 43.5222 283.179 47.626 281.583 51.3878C279.987 55.1497 277.735 58.3985 274.828 61.1344C271.922 63.8702 268.502 66.0076 264.569 67.5466C260.693 69.0855 256.447 69.855 251.83 69.855ZM251.745 60.1084C254.765 60.1084 257.558 59.5954 260.123 58.5695C262.688 57.5435 264.911 56.0901 266.792 54.2092C268.673 52.2713 270.126 50.0484 271.152 47.5405C272.235 44.9756 272.777 42.1543 272.777 39.0764C272.777 35.9986 272.235 33.2057 271.152 30.6978C270.126 28.1329 268.673 25.91 266.792 24.0291C264.911 22.0912 262.688 20.6093 260.123 19.5833C257.558 18.5574 254.765 18.0444 251.745 18.0444C248.724 18.0444 245.931 18.5574 243.366 19.5833C240.858 20.6093 238.635 22.0912 236.697 24.0291C234.816 25.91 233.334 28.1329 232.251 30.6978C231.226 33.2057 230.713 35.9986 230.713 39.0764C230.713 42.0973 231.226 44.8901 232.251 47.455C233.334 50.0199 234.816 52.2713 236.697 54.2092C238.578 56.0901 240.801 57.5435 243.366 58.5695C245.931 59.5954 248.724 60.1084 251.745 60.1084ZM295.758 69V9.15281H304.906L342.438 55.2352H337.907V9.15281H348.936V69H339.788L302.255 22.9177H306.787V69H295.758Z" fill="#15234F"/>
<path d="M364.283 64.681H354.24V68.6299H352.368V58.5195H354.24V62.4683H364.283V64.681ZM364.283 56.8589H352.368V51.9568C352.368 50.9015 352.538 49.9994 352.879 49.2505C353.219 48.4902 353.707 47.9058 354.342 47.4973C354.978 47.0888 355.733 46.8846 356.606 46.8846C357.48 46.8846 358.235 47.0888 358.87 47.4973C359.494 47.9058 359.976 48.4902 360.317 49.2505C360.646 49.9994 360.81 50.9015 360.81 51.9568V55.6333L359.806 54.6461H364.283V56.8589ZM364.283 49.0632L359.959 52.076V49.71L364.283 46.6803V49.0632ZM360.044 54.6461L358.989 55.6333V52.0589C358.989 51.0831 358.779 50.3512 358.359 49.8632C357.94 49.364 357.355 49.1143 356.606 49.1143C355.846 49.1143 355.262 49.364 354.853 49.8632C354.445 50.3512 354.24 51.0831 354.24 52.0589V55.6333L353.151 54.6461H360.044ZM364.283 46.094L352.368 40.7324V38.5537L364.283 33.1751V35.49L353.542 40.1026V39.2176L364.283 43.8132V46.094ZM361.525 43.626L359.789 43.0302V36.5963L361.525 36.0006V43.626ZM364.283 31.6598H352.368V26.4514C352.368 25.1578 352.618 24.0231 353.117 23.0472C353.616 22.0714 354.308 21.3111 355.194 20.7664C356.079 20.2218 357.123 19.9494 358.325 19.9494C359.517 19.9494 360.561 20.2218 361.457 20.7664C362.342 21.3111 363.035 22.0714 363.534 23.0472C364.033 24.0231 364.283 25.1578 364.283 26.4514V31.6598ZM362.41 29.4471V26.5536C362.41 25.6571 362.24 24.8855 361.9 24.2387C361.559 23.5806 361.083 23.0756 360.47 22.7238C359.857 22.3607 359.142 22.1792 358.325 22.1792C357.497 22.1792 356.782 22.3607 356.181 22.7238C355.568 23.0756 355.091 23.5806 354.751 24.2387C354.411 24.8855 354.24 25.6571 354.24 26.5536V29.4471H362.41ZM357.321 15.5551V9.63182H359.142V15.5551H357.321ZM362.427 15.3849V8.66162H364.283V17.5976H352.368V8.89992H354.223V15.3849H362.427Z" fill="#00BDFF"/>
<path d="M19.9069 4.48321C14.1153 7.54401 9.23746 12.0817 5.76776 17.6363C-5.13211 35.0797 0.20356 58.1466 17.6618 69.0557C29.3586 76.3646 43.5703 76.3802 54.9566 70.3563C59.5797 67.9127 63.6345 64.5214 66.8561 60.4039C70.0777 56.2863 72.3938 51.5352 73.6531 46.4606C72.1715 46.7443 70.6375 46.5417 69.2798 45.883C68.1189 50.2606 66.0656 54.3506 63.2487 57.8966C60.4317 61.4426 56.9119 64.3681 52.9099 66.4897C42.8669 71.8124 30.3364 71.7924 19.9968 65.3316C4.56806 55.6906 -0.130638 35.3775 9.50216 19.9619C12.5601 15.0593 16.8604 11.0526 21.9676 8.34761C32.0106 3.02481 44.5411 3.04481 54.8807 9.50561C58.9751 12.0598 62.4573 15.4833 65.0802 19.5331C67.7031 23.5828 69.4023 28.1595 70.0571 32.9382C71.4806 32.4502 73.0235 32.4315 74.4591 32.8849C73.1182 22.1023 67.1247 11.9875 57.2037 5.78811C45.5027 -1.52659 31.291 -1.54219 19.9069 4.48321Z" fill="#15234F"/>
<path d="M65.8867 30.6274C62.2569 14.9048 46.5685 5.10162 30.8459 8.73152C15.1232 12.3613 5.32 28.0497 8.9499 43.7723C12.5798 59.495 28.2681 69.2981 43.9908 65.6683C59.7134 62.0384 69.5166 46.3501 65.8867 30.6274Z" fill="white"/>
<mask id="mask0_9_4" style={{maskType:'luminance'}} maskUnits="userSpaceOnUse" x="21" y="22" width="35" height="31">
<path d="M55.9082 22.2209H21.4702V52.624H55.9082V22.2209Z" fill="white"/>
</mask>
<g mask="url(#mask0_9_4)">
<path d="M49.1372 52.624H55.9083V22.2209H49.1372V52.624Z" fill="#357EBF"/>
<path d="M26.4605 22.2209H21.4702V26.2319L39.6787 52.624H48.0208L26.4605 22.2209Z" fill="#15234F"/>
<path d="M27.0765 52.5997C30.1191 52.5997 32.5856 50.1317 32.5856 47.0873C32.5856 44.0429 30.1191 41.575 27.0765 41.575C24.0339 41.575 21.5674 44.0429 21.5674 47.0873C21.5674 50.1317 24.0339 52.5997 27.0765 52.5997Z" fill="#F5C956"/>
<path d="M46.1043 32.3106C46.3625 28.7817 45.1112 26.2071 43.0853 24.6116C41.0593 23.0162 37.7225 22.2209 32.9854 22.2209H28.0845C36.3669 32.6982 45.1012 46.2323 46.1043 32.3106Z" fill="#00BDFF"/>
</g>
<path d="M74.7376 41.2383C75.5082 40.005 75.1323 38.38 73.898 37.6088C72.6637 36.8375 71.0384 37.212 70.2678 38.4452C69.4972 39.6785 69.8731 41.3035 71.1073 42.0747C72.3416 42.846 73.9669 42.4715 74.7376 41.2383Z" fill="#3EAE31"/>
</g>
</svg>
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
                  <div className="p-4 py-10 mt-20 text-xl text-center font-medium rounded-xl transition-all duration-300 border shadow-sm  meta-border meta-shine hover:meta-glow flex flex-col gap-10 items-center">
                    <Button size="lg" type="button" variant="primary" className="text-xl"
                    onClick={()=> setShowForm(true)}
                    >Link your Account</Button>
                    <span>Don't have the account?{" "}

                    {selectedBroker === 'MT4' && <Link target="_blank" href="https://secure.m4markets.com/links/go/6758" className="text-primary underline underline-offset-3">Create Account</Link>}
                    {selectedBroker === 'vantage' && <Link target="_blank" href="https://www.vantagemarkets.com/forex-trading/forex-trading-account/?affid=20790362" className="text-primary underline underline-offset-3">Create Account</Link>}
                    {selectedBroker === 'orontrade' && <Link target="_blank" href="https://my.orontrade.com/Account/Register?id=ikvKmpuP2A" className="text-primary underline underline-offset-3">Create Account</Link>}
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
