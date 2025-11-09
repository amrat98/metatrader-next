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
        {/* <div className="animate-slide-up">
          <h1 className="text-3xl font-bold">
            <span className="diamond-text">Wallet</span>
          </h1>
          <p className="text-slate-400">Manage your deposits and withdrawals</p>
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="glass-effect hover:scale-102 transition-all duration-300 group flex-1 gap-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-4 to-brand-5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <WalletIcon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-brand-5 text-lg">Income Balance</CardTitle>
                </div>
                <PiggyBank className="size-8 text-brand-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold bg-gradient-to-r from-brand-4 to-brand-5 bg-clip-text text-transparent">
              {formatPrice(globalasset?.contributionBalance || 0)}
              </p>
              <p className="text-sm text-slate-400">Available for trading and withdrawal</p>
            </CardContent>
          </Card>
          <Card className="glass-effect hover:scale-102 transition-all duration-300 group flex-1 gap-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-3 to-brand-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <WalletIcon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-brand-3 text-lg">Assets Balance</CardTitle>
                </div>
                <PiggyBank className="size-8 text-brand-3" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold bg-gradient-to-r from-brand-3 to-brand-4 bg-clip-text text-transparent">
              {formatPrice(globalasset?.balance || 0)}
              </p>
              <p className="text-sm text-slate-400">Available for trading and withdrawal</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 pb-5">
          <Tabs defaultValue="deposit" className="gap-4">
            <TabsList className="glass-effect shadow-sm w-full h-auto p-1 overflow-auto justify-normal gap-2 bg-white" >
              <TabsTrigger value="deposit" className="data-[state=active]:bg-brand-5 data-[state=active]:text-white p-2 px-4 cursor-pointer border-1 border-brand-5/10 hover:bg-brand-5/5">
                <ArrowDownCircle className="size-5" />
                Deposit
              </TabsTrigger>
              <TabsTrigger value="transfer" className="data-[state=active]:bg-brand-5 data-[state=active]:text-white p-2 px-4 cursor-pointer border-1 border-brand-5/10 hover:bg-brand-5/5">
                <Coins className="size-5" />
                Internal Transfer
              </TabsTrigger>
              <TabsTrigger value="withdraw" className="data-[state=active]:bg-brand-5 data-[state=active]:text-white p-2 px-4 cursor-pointer border-1 border-brand-5/10 hover:bg-brand-5/5">
                <ArrowUpCircle className="size-5" />
                Withdraw
              </TabsTrigger>
              <TabsTrigger value="redeem" className="data-[state=active]:bg-brand-5 data-[state=active]:text-white p-2 px-4 cursor-pointer border-1 border-brand-5/10 hover:bg-brand-5/5">
                <Gift className="size-5" />
                Redeem
              </TabsTrigger>
            </TabsList>
            <TabsContent value="deposit"><Deposit /></TabsContent>
            <TabsContent value="transfer"><Transfer /></TabsContent>
            <TabsContent value="withdraw"><Withdraw /></TabsContent>
            <TabsContent value="redeem"><Redeem /></TabsContent>
          </Tabs>
        </div>
        <TransitionTable />
      </div>
    </>
  );
}
