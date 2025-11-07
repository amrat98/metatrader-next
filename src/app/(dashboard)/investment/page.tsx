"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, PiggyBank, WalletIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import InvestmentTable from "./investmenttable";
import InvestmentPlan from "./investmentplan";
import { Separator } from "@/components/ui/separator";
import { useContext } from "react";
import { UserContext } from "@/lib/usercontent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { profile } from "console";

const cardStyle =
  "bg-card border-2  border-primary rounded-lg lg:rounded-2xl flex flex-row overflow-hidden ";

// interface GlobalAsset {
//   incomeBalance: number;
//   balance: number;
  
// }

export default function Investment() {
  const [mounted, setMounted] = useState(false);
  const { profile, globalasset } = useContext(UserContext) || {};
  //const asset = globalasset as GlobalAsset | undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-5 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Card className="glass-effect hover:scale-102 transition-all duration-300 group flex-1 gap-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-3 to-brand-5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <WalletIcon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-brand-5 text-lg">Balance</CardTitle>
                </div>
                <PiggyBank className="size-8 text-brand-3" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold bg-gradient-to-r from-brand-3 to-brand-5 bg-clip-text text-transparent">
              {formatPrice(profile?.userResult.fxAccountBalance || 0)}
              </p>
              {/* <p className="text-sm text-slate-400">Available for trading and withdrawal</p> */}
            </CardContent>
          </Card>
        </div>
      
        {/* <div className="flex-1 hidden">
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3">
            My Investment Plan
          </h2>
          <InvestmentPlan />
        </div> */}
        <div className="flex-1 pb-5">
          <InvestmentTable />
        </div>
      </div>
    </>
  );
}
