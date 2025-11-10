"use client";
import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WalletIcon, TrendingUp, PiggyBank, ArrowDownCircle, ArrowUpCircle, History, Gift, Coins } from "lucide-react";
import { useContext } from "react";
import { UserContext } from "@/lib/usercontent";
import { formatPrice } from "@/lib/utils";
import TransitionTable from "./transactiontable";
import Deposit from "./deposit";
import Transfer from "./transfer";
import Withdraw from "./withdraw";
import Redeem from "./redeam";

const cardStyle =
  "bg-card border-2  border-primary rounded-lg lg:rounded-2xl flex flex-row overflow-hidden ";

// interface GlobalAsset {
//   incomeBalance: number;
//   balance: number;
// }

export default function Assets() {
  const { globalasset } = useContext(UserContext) || {};
  //const asset = globalasset as GlobalAsset | undefined;

  return (
    <>
      <div className="flex flex-1 flex-col gap-8 p-4">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold mb-2">
            <span className="meta-text">Wallet</span>
          </h1>
          <p className="text-muted-foreground">Manage your deposits and withdrawals</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="glass-effect hover:scale-102 transition-all duration-300 group flex-1 gap-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-extra-4 to-extra-5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <WalletIcon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-white text-lg">Income Balance</CardTitle>
                </div>
                <TrendingUp className="size-8 text-extra-3" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold bg-gradient-to-r from-brand-1 to-brand-2 bg-clip-text text-transparent">
              {formatPrice(globalasset?.contributionBalance || 0)}
              </p>
              <p className="text-sm text-muted-foreground">Available for trading and withdrawal</p>
            </CardContent>
          </Card>
          <Card className="glass-effect hover:scale-102 transition-all duration-300 group flex-1 gap-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-extra-3 to-extra-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <WalletIcon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-white text-lg">Assets Balance</CardTitle>
                </div>
                <PiggyBank className="size-8 text-extra-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold bg-gradient-to-r from-brand-1 to-brand-2 bg-clip-text text-transparent">
              {formatPrice(globalasset?.balance || 0)}
              </p>
              <p className="text-sm text-muted-foreground">Available for trading and withdrawal</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 pb-5">
          <Tabs defaultValue="deposit" className="gap-4">
            <TabsList className="glass-effect shadow-sm w-full h-auto p-1 overflow-auto justify-normal gap-2 meta-shine meta-border" >
              <TabsTrigger value="deposit" className="dark:data-[state=active]:meta-shine dark:data-[state=active]:text-brand-2 border-0 p-2 px-4 cursor-pointer dark:hover:meta-shine dark:hover:text-brand-2">
                <ArrowDownCircle className="size-5" />
                Deposit
              </TabsTrigger>
              <TabsTrigger value="transfer" className="dark:data-[state=active]:meta-shine dark:data-[state=active]:text-brand-2 border-0 p-2 px-4 cursor-pointer dark:hover:meta-shine dark:hover:text-brand-2">
                <Coins className="size-5" />
                Internal Transfer
              </TabsTrigger>
              <TabsTrigger value="withdraw" className="dark:data-[state=active]:meta-shine dark:data-[state=active]:text-brand-2 border-0 p-2 px-4 cursor-pointer dark:hover:meta-shine dark:hover:text-brand-2">
                <ArrowUpCircle className="size-5" />
                Withdraw
              </TabsTrigger>
              <TabsTrigger value="redeem" className="dark:data-[state=active]:meta-shine dark:data-[state=active]:text-brand-2 border-0 p-2 px-4 cursor-pointer dark:hover:meta-shine dark:hover:text-brand-2">
                <Gift className="size-5" />
                Redeem
              </TabsTrigger>
              <TabsTrigger value="history" className="dark:data-[state=active]:meta-shine dark:data-[state=active]:text-brand-2 border-0 p-2 px-4 cursor-pointer dark:hover:meta-shine dark:hover:text-brand-2">
                <History className="size-5" />
                Transaction History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="deposit"><Deposit /></TabsContent>
            <TabsContent value="transfer"><Transfer /></TabsContent>
            <TabsContent value="withdraw"><Withdraw /></TabsContent>
            <TabsContent value="redeem"><Redeem /></TabsContent>
            <TabsContent value="history"><TransitionTable /></TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
