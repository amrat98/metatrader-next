"use client";
import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Download, QrCode } from "lucide-react";
import { useContext } from "react";
import { UserContext } from "@/lib/usercontent";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface GlobalAsset {
  address: string;
}

export default function Deposit() {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { globalasset } = useContext(UserContext) || {};
  const asset = globalasset as GlobalAsset | undefined;
  const depositAddress = asset?.address;
  //console.log(depositAddress);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard && depositAddress) {
      navigator.clipboard.writeText(depositAddress);
      //toast.success("Address copied to clipboard!");
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
      }, 1000);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white text-lg lg:text-2xl font-bold">Deposit USDT</CardTitle>
        <CardDescription className="text-slate-400 font-medium">Deposit USDT to your trading wallet (BEP20 Network)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-xl meta-border meta-shine space-y-3">
          <p className="text-sm font-medium text-brand-1">Your Deposit Address</p>
          <div className="flex items-stretch gap-2">
            <code className="flex-1 text-base font-mono text-white font-bold p-3 rounded-lg overflow-x-auto border-2 bg-slate-950">
              {depositAddress}
            </code>
            <TooltipProvider>
              <Tooltip open={showTooltip}>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="icon"
                    className="size-13 shrink-0 cursor-pointer bg-brand-5 hover:bg-brand-4"
                    onClick={handleCopy}
                  >
                    <Copy className="size-5" />
                    <span className="sr-only">
                      Copy referral link
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copied</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex flex-col gap-3 items-center justify-center">
        {depositAddress && (
        <>
          <div className="p-3 rounded-xl border-2 w-52 max-w-full">
            <Image
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(depositAddress)}&color=FFFFFF&bgcolor=000000`}
              alt="Deposit Address QR"
              width={150}
              height={150}
              className="w-full h-full"
            />
          </div>
          <div className="w-full p-3 rounded-lg border-2 border-accent">
            <p className="text-sm font-medium text-muted-foreground mb-1 text-center">Scan this QR code or copy address</p>
            <code className="text-base font-mono font-bold text-white break-all block text-center">
              {depositAddress}
            </code>
          </div>
          {/* <Button
            // onClick={downloadQR}
            variant="secondary"
            className=""
          >
            <Download className="size-5" />
            Download
          </Button> */}
        </>
        )}
        </div>
        <div className="p-4 rounded-lg bg-extra-1/20 border border-extra-1/50 mt-10">
          <p className="text-sm text-extra-1 font-semibold mb-2">Important Notes:</p>
          <p className="text-xs mb-1">Ensure you use BEP20 to deposit or assets might be lost</p>
          <ul className="text-xs space-y-1 list-disc list-inside">
            <li>Please do not deposit any non-USDT assets to the assess above.</li>
            <li>Minimum deposit: 10 USDT</li>
            <li>The deposit may take a short while to arrive.</li>
            <li>Funds may not be withdrawn from inactive accounts.</li>
          </ul>
        </div>
      </CardContent>
    </Card>



    // <div className="rounded-xl border bg-white shadow-sm glass-effect p-5 py-10 lg:p-10">
    //   <h2 className="text-lg lg:text-2xl font-semibold">
    //     Deposit USDT
    //   </h2>
    //   <p className="text-slate-500">Deposit USDT to your trading wallet (BEP20 Network)</p>

    //   <div className="flex flex-wrap mt-8 gap-10">
    //     <div className="size-50 bg-white p-3 rounded-md">
    //       {depositAddress ? (
    //         <Image
    //           src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(depositAddress)}&color=FFFFFF&bgcolor=000000`}
    //           alt="Deposit Address QR"
    //           width={150}
    //           height={150}
    //           className="w-full h-full"
    //         />
    //       ) : (
    //         <div className="w-full h-full flex items-center justify-center text-primary">
    //           Loading QR...
    //         </div>
    //       )}
    //     </div>
    //     <div className="flex-1">
    //       <label
    //         htmlFor="referral-link"
    //         className="text-lg font-semibold text-primary mb-2 block"
    //       >
    //         USDT BEP 20 Deposit Address
    //       </label>
    //       <div className="flex gap-2 relative min-w-3xs max-w-3xl">
    //         <Input
    //           id="referral-link"
    //           value={depositAddress || ""}
    //           readOnly
    //           className="h-14 text-base border-primary pr-14"
    //         />
    //         <TooltipProvider>
    //           <Tooltip open={showTooltip}>
    //             <TooltipTrigger
    //               asChild
    //               className="absolute right-2 top-2"
    //             >
    //               <Button
    //                 variant="link"
    //                 size="icon"
    //                 className="size-10 shrink-0 cursor-pointer"
    //                 onClick={handleCopy}
    //               >
    //                 <Copy className="size-5" />
    //                 <span className="sr-only">
    //                   Copy referral link
    //                 </span>
    //               </Button>
    //             </TooltipTrigger>
    //             <TooltipContent>
    //               <p>Copied</p>
    //             </TooltipContent>
    //           </Tooltip>
    //         </TooltipProvider>
    //       </div>
    //       <div className="text-base mt-8 flex flex-col gap-2">
    //         <p className="font-semibold">
    //           Ensure you use BEP20 to deposit or assets might be lost
    //         </p>
    //         <p>
    //           1. Please do not deposit any non-USDT assets to the
    //           assess above.
    //         </p>
    //         <p>2. The deposit may take a short while to arrive.</p>
    //         <p>
    //           3. Funds may not be withdrawn from inactive accounts.
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </div>



  );
}