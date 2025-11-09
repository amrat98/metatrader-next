"use client";
import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from "@/lib/utils";
import { useContext } from "react";
import { UserContext } from "@/lib/usercontent";
import AllIncomeView from "./allincomeview";
import TeamDividentView from "./teamdividentview";
import MatchingRewardView from "./matchingrewardview";
import { BanknoteArrowUp, CalendarArrowUp, ChartSpline, Gem, GitFork, PiggyBank, Sparkle, Users, WalletIcon, Waypoints } from "lucide-react";

const cardStyle =
  "bg-card border-2  border-primary rounded-lg lg:rounded-2xl flex flex-row overflow-hidden ";

export default function Income() {
  const { profile, globalasset, dashBoardData } = useContext(UserContext) || {};

  const data = {
    income: {
      divident_income_title: "Introduction Bonus",
      divident_income_value: dashBoardData?.combinedResults?.find(r => r.rewardType === "Referral")?.totalProfit || 0,
      team_divident_income_title: "PAMM Profit",
      team_divident_income_value: dashBoardData?.combinedResults?.find(r => r.rewardType === "ROI")?.totalProfit || 0,
      direct_referral_income_title: "Profit Sharing",
      direct_referral_income_value: dashBoardData?.combinedResults?.find(r => r.rewardType === "TEAM_ROI")?.totalProfit || 0,
      rank_income_title: "Billionaire Club",
      rank_income_value: (dashBoardData?.combinedResults?.find(r => r.rewardType === "BILLIONAIR_CLUB")?.totalProfit || 0) + (dashBoardData?.combinedResults?.find(r => r.rewardType === "BILLIONAIR_CONTRIBUTION")?.totalProfit || 0),
      matching_reward_income_title: "Monthly Allowance",
      matching_reward_income_value: dashBoardData?.combinedResults?.find(r => r.rewardType === "MONTHLY_ALLOWANCE")?.totalProfit || 0,
      total_income_title: "IB Matching",
      total_income_value: dashBoardData?.combinedResults?.find(r => r.rewardType === "MATCHING_BONUS_REWARD")?.totalProfit || 0,
      // total_withdraw_title: "Weekly Allowance",
      // total_withdraw_value: dashBoardData?.combinedResults?.find(r => r.rewardType === "WEEKLY_ALLOWANCE")?.totalProfit || 0,
    },
    filter: [
      {
        label: "All",
        value: "ALL",
      },
      {
        label: "Dividend Daily",
        value: "MATCHING_REWARD_BONUS",
      },
      {
        label: "Dividend Monthly",
        value: "ROI_MONTHLY",
      },
      {
        label: "Referral Income",
        value: "Referral",
      },
      {
        label: "Team Dividend",
        value: "TEAM_ROI",
      },
      {
        label: "Rank Income",
        value: "MATCHING_BONUS",
      },
    ]
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-5 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <Card className="glass-effect hover:scale-102 transition-all duration-300 group flex-1 gap-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-4 to-brand-5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkle className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-brand-5 text-lg">{data.income.divident_income_title}</CardTitle>
                </div>
                {/* <PiggyBank className="size-8 text-brand-4" /> */}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold bg-gradient-to-r from-brand-4 to-brand-5 bg-clip-text text-transparent">
              {formatPrice(data.income.divident_income_value)}
              </p>
              {/* <p className="text-sm text-slate-400">Available for trading and withdrawal</p> */}
            </CardContent>
          </Card>
          <Card className="glass-effect hover:scale-102 transition-all duration-300 group flex-1 gap-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-3 to-brand-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ChartSpline className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-brand-3 text-lg">{data.income.team_divident_income_title}</CardTitle>
                </div>
                {/* <PiggyBank className="size-8 text-brand-3" /> */}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold bg-gradient-to-r from-brand-3 to-brand-4 bg-clip-text text-transparent">
              {formatPrice(data.income.team_divident_income_value)}
              </p>
              {/* <p className="text-sm text-slate-400">Available for trading and withdrawal</p> */}
            </CardContent>
          </Card>
          <Card className="glass-effect hover:scale-102 transition-all duration-300 group flex-1 gap-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-1 to-brand-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Waypoints className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-brand-1 text-lg"> {data.income.direct_referral_income_title}</CardTitle>
                </div>
                {/* <PiggyBank className="size-8 text-brand-1" /> */}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold bg-gradient-to-r from-brand-1 to-brand-2 bg-clip-text text-transparent">
              {formatPrice(data.income.direct_referral_income_value)}
              </p>
              {/* <p className="text-sm text-slate-400">Available for trading and withdrawal</p> */}
            </CardContent>
          </Card>
          <Card className="glass-effect hover:scale-102 transition-all duration-300 group flex-1 gap-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-2 to-brand-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <WalletIcon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-brand-3 text-lg">{data.income.rank_income_title}</CardTitle>
                </div>
                {/* <PiggyBank className="size-8 text-brand-3" /> */}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold bg-gradient-to-r from-brand-3 to-brand-2 bg-clip-text text-transparent">
              {formatPrice(data.income.rank_income_value)}
              </p>
              {/* <p className="text-sm text-slate-400">Available for trading and withdrawal</p> */}
            </CardContent>
          </Card>
          <Card className="glass-effect hover:scale-102 transition-all duration-300 group flex-1 gap-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-1 to-brand-5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CalendarArrowUp className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-brand-5 text-lg">{data.income.matching_reward_income_title}</CardTitle>
                </div>
                {/* <PiggyBank className="size-8 text-brand-4" /> */}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold bg-gradient-to-r from-brand-5 to-brand-1 bg-clip-text text-transparent">
              {formatPrice(data.income.matching_reward_income_value)}
              </p>
              {/* <p className="text-sm text-slate-400">Available for trading and withdrawal</p> */}
            </CardContent>
          </Card>
          <Card className="glass-effect hover:scale-102 transition-all duration-300 group flex-1 gap-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-3 to-brand-1 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <GitFork className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-brand-3 text-lg">{data.income.total_income_title}</CardTitle>
                </div>
                {/* <PiggyBank className="size-8 text-brand-3" /> */}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold bg-gradient-to-r from-brand-1 to-brand-3 bg-clip-text text-transparent">
              {formatPrice(data.income.total_income_value)}
              </p>
              {/* <p className="text-sm text-slate-400">Available for trading and withdrawal</p> */}
            </CardContent>
          </Card>
        </div>


        <div className="flex-1 pb-5">
          <Tabs defaultValue="all" className="gap-4">
          <TabsList className="glass-effect shadow-sm w-full h-auto p-1 overflow-auto justify-normal gap-2 bg-white" >
              <TabsTrigger value="all" className="data-[state=active]:bg-brand-5 data-[state=active]:text-white p-2 px-4 cursor-pointer border-1 border-brand-5/10 hover:bg-brand-5/5">
                <BanknoteArrowUp className="size-5" />
                All income
              </TabsTrigger>
              <TabsTrigger value="team_divident_income" className="data-[state=active]:bg-brand-5 data-[state=active]:text-white p-2 px-4 cursor-pointer border-1 border-brand-5/10 hover:bg-brand-5/5">
                <Users className="size-5" />
                Team divident income
              </TabsTrigger>
              <TabsTrigger value="matching_reward_income" className="data-[state=active]:bg-brand-5 data-[state=active]:text-white p-2 px-4 cursor-pointer border-1 border-brand-5/10 hover:bg-brand-5/5">
                <Gem className="size-5" />
                Matching reward income
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all"><AllIncomeView /></TabsContent>
            <TabsContent value="team_divident_income"><TeamDividentView /></TabsContent>
            <TabsContent value="matching_reward_income"><MatchingRewardView /></TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
