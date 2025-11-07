"use client";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Progress } from "@/components/ui/progress";
import BoosterPro from "./boosterpro";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRef, useState, useEffect, useMemo } from "react";
import { useContext } from "react";
import { UserContext } from "@/lib/usercontent";
import { cn, formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import CreditCard from "./creditcard"; 
import { Sparkle, User, ChartSpline, GitFork, Waypoints, WalletIcon, CalendarArrowUp } from "lucide-react";



const cardStyle =
  "bg-card border-2 border-primary rounded-lg lg:rounded-2xl flex flex-row overflow-hidden transition-transform duration-300";
  // " " +
  // "[perspective:1000px] hover:scale-105 hover:shadow-2xl hover:-rotate-x-2 hover:-rotate-y-1";

// Countdown Timer Component
function CountdownTimer({ activationDate }: { activationDate?: string }) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [expired, setExpired] = useState(false);

  const targetDate = useMemo(() => {
    if (!activationDate) return null;
    const actDate = new Date(activationDate);
    return new Date(actDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  }, [activationDate]);

  useEffect(() => {
    if (!targetDate) return;
    const update = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      setTimeLeft(diff > 0 ? diff : 0);
      setExpired(diff <= 0);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const formatTime = (ms: number) => {
    if (ms <= 0) return ["00", "00", "00", "00"];
    const totalSeconds = Math.floor(ms / 1000);
    const days = String(Math.floor(totalSeconds / 86400)).padStart(2, "0");
    const hours = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return [days, hours, minutes, seconds];
  };

  const [days, hours, minutes, seconds] = formatTime(timeLeft);
  return (
    <>
      <div className="flex items-start justify-center gap-2">
        <span>
          {days}<span className="text-xs text-muted-foreground font-semibold block text-center">Day</span>
        </span>
        <span className="mx-1">:</span>
        <span>
          {hours}<span className="text-xs text-muted-foreground font-semibold block text-center">Hr</span>
        </span>
        <span className="mx-1">:</span> 
        <span>
        {minutes}<span className="text-xs text-muted-foreground font-semibold block text-center">Min</span>
        </span>
        <span className="mx-1">:</span>
        <span>
        {seconds}<span className="text-xs text-muted-foreground font-semibold block text-center">Sec</span>
        </span>
      </div>
      {expired && (
        <span className="p-3 lg:p-5 text-md lg:text-lg font-bold w-full block">You are not Billionaire club member</span>
      )}
    </>
  );
}

export default function Dashboard() {
  const { profile, globalasset, dashBoardData, teamComposition, teamData, monthBusiness, bannerData } = useContext(UserContext) || {};
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  //console.log(profile);

  const [progress, setProgress] = useState(0);

  const progressPercentage = profile?.eligible && profile?.remainingEarning
    ? (1 - Number(profile.remainingEarning) / Number(profile.eligible)) * 100
    : 0;

  const remainingEarning = progress >= 99.9 ? 0 : profile?.remainingEarning;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(progressPercentage), 100);
    return () => clearTimeout(timer);
  }, [progressPercentage]);


  //const remainingEarning = 0;

  const data = {
    cards_income: [
      {
        name: "introduction_bonus",
        title: "Introduction Bonus",
        price: dashBoardData?.combinedResults?.find(r => r.rewardType === "Referral")?.totalProfit || 0,
        icon: Sparkle,
        iconBg: "from-brand-4 to-brand-5",
        colorTitle: "text-brand-5",
        colorPrice: "from-brand-4 to-brand-5",
      },
      {
        name: "paam_profit",
        title: "PAMM Profit",
        price: dashBoardData?.combinedResults?.find(r => r.rewardType === "ROI")?.totalProfit || 0,
        icon: ChartSpline,
        iconBg: "from-brand-3 to-brand-4",
        colorTitle: "text-brand-3",
        colorPrice: "from-brand-3 to-brand-4",
      },
      {
        name: "profit_sharing",
        title: "Profit Sharing",
        price: dashBoardData?.combinedResults?.find(r => r.rewardType === "TEAM_ROI")?.totalProfit || 0,
        icon: Waypoints,
        iconBg: "from-brand-1 to-brand-2",
        colorTitle: "text-brand-1",
        colorPrice: "from-brand-1 to-brand-2",
      },
      {
        name: "billionaire_club",
        title: "Billionaire Club",
        price: (dashBoardData?.combinedResults?.find(r => r.rewardType === "BILLIONAIR_CLUB")?.totalProfit || 0) + (dashBoardData?.combinedResults?.find(r => r.rewardType === "BILLIONAIR_CONTRIBUTION")?.totalProfit || 0),
        icon: WalletIcon,
        iconBg: "from-brand-2 to-brand-3",
        colorTitle: "text-brand-3",
        colorPrice: "from-brand-3 to-brand-2",
      },
      {
        name: "monthly_allowance",
        title: "Monthly Allowance",
        price: dashBoardData?.combinedResults?.find(r => r.rewardType === "MONTHLY_ALLOWANCE")?.totalProfit || 0,
        icon: CalendarArrowUp,
        iconBg: "from-brand-1 to-brand-5",
        colorTitle: "text-brand-5",
        colorPrice: "from-brand-5 to-brand-1",
      },
      {
        name: "ib_matching",
        title: "IB Matching",
        price: dashBoardData?.combinedResults?.find(r => r.rewardType === "MATCHING_BONUS_REWARD")?.totalProfit || 0,
        icon: GitFork,
        iconBg: "from-brand-3 to-brand-1",
        colorTitle: "text-brand-3",
        colorPrice: "from-brand-1 to-brand-3",
      },
      // {
      //   name: "weekly_allowance",
      //   title: "Weekly Allowance",
      //   price: dashBoardData?.combinedResults?.find(r => r.rewardType === "WEEKLY_ALLOWANCE")?.totalProfit || 0
      // },
      // {
      //   name: "contribution_balance",
      //   title: "Contribution Balance",
      //   price: globalasset?.contributionBalance || 0
      // },
      // {
      //   name: "billionaire_contribution",
      //   title: "Billionair contribution",
      //   price: globalasset?.billionaireContribution || 0
      // },
      // {
      //   name: "billionaire_club_income",
      //   title: "Billionair club income",
      //   price: globalasset?.billionaireClubIncome || 0
      // },
      

      // {
      //   name: "divided",
      //   title: "Dividend Income",
      //   price: dashBoardData 
      //     ? (dashBoardData.combinedResults?.find(r => r.rewardType === "ROI_DAILY")?.totalProfit || 0) +
      //       (dashBoardData.combinedResults?.find(r => r.rewardType === "ROI_MONTHLY")?.totalProfit || 0)
      //     : 0
      // },
      // {
      //   name: "team_divided",
      //   title: "Team Dividend Income",
      //   price: dashBoardData?.combinedResults?.find(r => r.rewardType === "TEAM_ROI")?.totalProfit || 0
      // },
      // {
      //   name: "direct_referral",
      //   title: "Direct Referral Income",
      //   price: dashBoardData?.combinedResults?.find(r => r.rewardType === "Referral")?.totalProfit || 0
      // },
      // {
      //   name: "rank",
      //   title: "Rank Income",
      //   price: dashBoardData?.combinedResults?.find(r => r.rewardType === "MATCHING_BONUS")?.totalProfit || 0
      // },
      // {
      //   name: "reward",
      //   title: "Matching Reward Income",
      //   price: dashBoardData?.combinedResults?.find(r => r.rewardType === "MATCHING_REWARD_BONUS")?.totalProfit || 0
      // },
      // {
      //   name: "club",
      //   title: "Club Income",
      //   price: dashBoardData?.combinedResults?.find(r => r.rewardType === "CLUB_INCOME")?.totalProfit || 0
      // },
      // {
      //   name: "total",
      //   title: "Total Income",
      //   price: profile?.userResult?.totalEarning || 0,
      //   titletwo: "Total Withdraw",
      //   pricetwo: profile?.withdrawlIncome || 0
      // }
    ],
    wallet: {
      title: "My Wallet Details",
      asset_title: "Assets Balance",
      asset_price: globalasset?.balance || 0,
      income_title: "Income Balance",
      income_price: globalasset?.incomeBalance || 0,
      contribution_title: "Contribution Balance",
      contribution_price: globalasset?.contributionBalance || 0,
    },
    team: {
      title: "My Team Details",
      strong_title: "PAMM Team A",
      strong_price: teamComposition?.bvTeamA || 0,
      weaker_title: "PAMM Team B",
      weaker_price: teamComposition?.bvTeamB || 0,
      total_title: "Total Direct",
      total_direct: teamComposition?.directTeam || 0,
      active_title: "Active Direct",
      active_direct: profile?.userResult?.activeDirectReferral || 0,
      team_title: "Total Team",
      total_team: teamComposition?.team || 0,
    },
    package: {
      title: "My Package Details",
      plan_price: profile?.userResult?.planPrice || "0",
      eligible: profile?.eligible || "0",
      max_earning: profile?.multiQ || "0",
      remaining_earning: remainingEarning,
    },
    slides: [
      {
        image: "/slide-1.png"
      },
      {
        image: "/slide-2.png"
      },
      {
        image: "/slide-1.png"
      },
      {
        image: "/slide-2.png"
      }
    ]
  };

  const directTeamBusiness = profile?.userResult?.directTeamBusiness;
  const activeDirectReferral = profile?.userResult?.activeDirectReferral;

  const boosterPercent = [
    {
      directTeamBusiness: 100,
      activeDirectReferral: 1,
      percentage: 20,
      value: 10,
    },
    {
      directTeamBusiness: 100,
      activeDirectReferral: 2,
      percentage: 20,
      value: 12,
    },
    {
      directTeamBusiness: 100,
      activeDirectReferral: 3,
      percentage: 20,
      value: 12,
    },
    {
      directTeamBusiness: 4000,
      activeDirectReferral: 4,
      percentage: 30,
      value: 14,
    },
    {
      directTeamBusiness: 5000,
      activeDirectReferral: 5,
      percentage: 30,
      value: 14,
    },
    {
      directTeamBusiness: 6000,
      activeDirectReferral: 6,
      percentage: 35,
      value: 16,
    },
    {
      directTeamBusiness: 7000,
      activeDirectReferral: 7,
      percentage: 35,
      value: 16,
    },
    {
      directTeamBusiness: 8000,
      activeDirectReferral: 8,
      percentage: 40,
      value: 18,
    },
    {
      directTeamBusiness: 9000,
      activeDirectReferral: 9,
      percentage: 40,
      value: 18,
    },
    {
      directTeamBusiness: 10000,
      activeDirectReferral: 10,
      percentage: 50,
      value: 20,
    },
  ];
  function getPercent(directTeamBusiness: number, activeDirectReferral: number): { percentage: number, value: number } {
    let percentage = 0;
    let value = 0;
    for (const item of boosterPercent) {
      if (
        directTeamBusiness >= item.directTeamBusiness &&
        activeDirectReferral >= item.activeDirectReferral
      ) {
        percentage = item.percentage;
        value = item.value;
      }
    }
    return { percentage, value };
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-5 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {data.cards_income.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="glass-effect hover:scale-102 transition-all duration-300 group flex-1 gap-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform ${card.iconBg}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className={`${card.colorTitle} text-lg`}>{card.title}</CardTitle>
                </div>
              </div>
              </CardHeader>
              <CardContent>
                <p className={`text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${card.colorPrice}`}>
                  {formatPrice(card.price.toString())}
                </p>
                {card.name === 'billionaire_club' && (
                <p className="text-sm text-slate-600 mt-2">50% will be sent to billionaire contribution</p>
              )}
              </CardContent>
            </Card>
          );
        })}

          {/* <div className="relative xl:row-start-1 xl:col-start-3 col-span-2 xl:col-auto">
            <div
                className={`${cardStyle} custom-card h-full items-center justify-center`}>
              <div className="flex-1 relative z-1 text-center">
                {profile?.userResult.isBillionaire === true ?
                  <span className="p-3 lg:p-5 text-md lg:text-lg font-bold w-full block">You are already <br/><span className="text-primary">Billionaire club member</span></span>
                  : <div className="text-lg sm:text-4xl 2xl:text-5xl font-bold p-3 lg:p-5 truncate"><CountdownTimer activationDate={profile?.userResult.activationDate} /></div>
                }
              </div>
            </div>
          </div> */}
          {/* <div className="relative col-span-2 xl:col-auto xl:row-start-2 xl:col-start-3 xl:row-span-2">
          <div
            className={`${cardStyle} custom-card h-full `}
          >
            <Carousel
              className="w-full h-full"
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[plugin.current]}
            >
              <CarouselContent className="h-full">
                {bannerData && bannerData.length > 0 ? (
                  <>
                    {bannerData.map((slide, index) => (
                      <CarouselItem
                        key={`${slide.id}-${index}`}
                        className="flex items-center justify-center">
                        <div className="p-3 w-full">
                          <Image
                            className="w-full"
                            src={slide.img}
                            alt={slide.title || `Slide-${index + 1}`}
                            width={440}
                            height={285}
                            priority
                          />
                        </div>
                      </CarouselItem>
                    ))}
                    {bannerData.length === 1 && (
                      <CarouselItem
                        key={`${bannerData[0].id}-duplicate`}
                        className="flex items-center justify-center">
                        <div className="p-3 w-full">
                          <Image
                            className="w-full"
                            src={bannerData[0].img}
                            alt={bannerData[0].title || 'Slide-2'}
                            width={440}
                            height={285}
                            priority
                          />
                        </div>
                      </CarouselItem>
                    )}
                  </>
                ) : null}
              </CarouselContent>
            </Carousel>
          </div>
          </div> */}
          <Card className="relative col-span-1 md:col-span-2 xl:col-span-3">
            <CardContent>
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <h2 className="text-sm sm:text-base lg:text-lg font-semibold">
                    {data.package.title}
                  </h2>
                  <div className="flex gap-2 items-center">
                    <span className="text-sm sm:text-base lg:text-lg font-semibold text-primary">
                    {formatPrice(data.package.plan_price)}
                    </span>
                    <span className="bg-primary rounded-lg text-background px-3 py-1 text-xs lg:text-sm font-semibold">
                    {formatPrice(data.package.eligible)} Eligible
                    </span>
                  </div>
                </div>
                <Separator orientation="horizontal" className="my-3 lg:my-5" />
                <div className="flex justify-between gap-5">
                  <span className="text-xs md:text-sm">
                    Max Earning:{" "}
                    <span className="text-primary font-semibold text-lg md:text-xl">
                      {data.package.max_earning}X
                    </span>
                  </span>
                  <span className="text-xs md:text-sm text-right">
                    Return Remaining:{" "}
                    <span className="text-primary font-semibold text-lg md:text-xl">
                    {formatPrice(data.package.remaining_earning ?? 0)}
                    </span>
                  </span>
                </div>
                <Progress value={progress} className="w-full h-2 my-3" />
                <div className="flex justify-between gap-2">
                  <span className="text-primary font-semibold text-xl">
                    {progress.toFixed(2)}%
                  </span>
                  <span className="text-primary font-semibold text-xl">100%</span>
                </div>
            </CardContent>
          </Card>
          {/* <div className="relative col-span-2 xl:col-auto xl:row-start-4 xl:col-start-3 xl:row-span-1">
          <div
            className={`${cardStyle} p-3 lg:p-5 relative z-1 flex justify-center items-center flex-col! gap-3 border-0! bg-transparent! shadow-none!`}>
              {profile && (
                <CreditCard profile={profile} />
              )}
          </div>
          </div> */}
          {/* <div
            className={`${cardStyle} p-3 lg:p-5 col-span-2 xl:col-auto xl:row-start-1 xl:col-start-3 xl:row-span-2 flex justify-between items-center flex-col! gap-3`}
          >
            <h2 className="text-base lg:text-lg font-semibold">Booster Pro</h2>
            <BoosterPro
            value={
              profile?.userResult?.isBoosterProActive
                ? { percentage: 100, value: 40 }
                : getPercent(directTeamBusiness || 0, activeDirectReferral || 0)
            }
             />
            <div className="flex flex-row items-center text-center gap-2 w-full">
              <div className="flex-1 flex flex-col">
              <span className="text-sm">Pro Booster</span>
              {profile?.userResult?.isBoosterProActive ? (
                <span className="text-green-600 font-bold">Active</span>
              )
                    : (
                      <span className="text-red-500 font-bold">Inactive</span>
                    )}
              </div>
              <Separator
                orientation="vertical"
                className="block my-auto min-w-0.4 bg-transparent bg-[radial-gradient(circle,_rgba(255,255,255,1)_0%,_rgba(0,0,0,0)_80%)]"
              />
              <div className="flex-1 flex flex-col">
              <span className="text-sm">Current Month Business</span>
              <span className="text-primary font-bold">{formatPrice(monthBusiness || 0)}</span>
              </div>
            </div>
          </div> */}

            <div className="relative  col-span-1 md:col-span-2 xl:col-span-3">
          <div
            className={`${cardStyle} custom-card flex flex-col! md:flex-row! items-stretch`}
            >
            <div className="p-3 lg:p-5 flex items-center justify-center md:border-r border-primary md:max-w-32">
              <h2 className="text-lg lg:text-2xl font-semibold text-primary text-center">
                {data.wallet.title}
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row flex-1">
              <div className="p-3 lg:p-5 self-center text-center flex-1">
                <h2 className="text-base lg:text-lg font-semibold">
                  {data.wallet.asset_title}
                </h2>
                <Separator orientation="horizontal" className="my-2" />
                <div className="text-2xl 2xl:text-3xl font-bold truncate">
                  {formatPrice(data.wallet.asset_price.toString())}
                </div>
              </div>
              <Separator
                orientation="vertical"
                className=" hidden sm:block mx-2 my-auto max-h-24 min-w-0.4 bg-transparent bg-[radial-gradient(circle,_rgba(255,255,255,1)_0%,_rgba(0,0,0,0)_60%)]"
              />
              <Separator
                orientation="horizontal"
                className="sm:hidden my-2 max-h-24 min-w-0.4 bg-transparent bg-[radial-gradient(circle,_rgba(255,255,255,1)_0%,_rgba(0,0,0,0)_60%)]"
              />
              <div className="p-3 lg:p-5 self-center text-center flex-1">
                <h2 className="text-base lg:text-lg font-semibold">
                {data.wallet.income_title}
                </h2>
                <Separator orientation="horizontal" className="my-2" />
                <div className="text-2xl 2xl:text-3xl font-bold truncate">
                  {formatPrice(data.wallet.income_price.toString())}
                </div>
              </div>
              <Separator
                orientation="vertical"
                className=" hidden sm:block mx-2 my-auto max-h-24 min-w-0.4 bg-transparent bg-[radial-gradient(circle,_rgba(255,255,255,1)_0%,_rgba(0,0,0,0)_60%)]"
              />
              <Separator
                orientation="horizontal"
                className="sm:hidden my-2 max-h-24 min-w-0.4 bg-transparent bg-[radial-gradient(circle,_rgba(255,255,255,1)_0%,_rgba(0,0,0,0)_60%)]"
              />
              <div className="p-3 lg:p-5 self-center text-center flex-1">
                <h2 className="text-base lg:text-lg font-semibold">
                {data.wallet.contribution_title}
                </h2>
                <Separator orientation="horizontal" className="my-2" />
                <div className="text-2xl 2xl:text-3xl font-bold truncate">
                  {formatPrice(data.wallet.contribution_price.toString())}
                </div>
              </div>
            </div>
          </div>
          </div>
          <div className="relative  col-span-1 md:col-span-2 xl:col-span-3">
          <div
            className={`${cardStyle} custom-card flex flex-col! md:flex-row! items-stretch`}
          >
            <div className="p-3 lg:p-5 flex items-center justify-center md:border-r border-primary md:max-w-32">
              <h2 className="text-lg lg:text-2xl font-semibold text-primary text-center">
                {data.team.title}
              </h2>
            </div>
            <div className="flex flex-col xl:flex-row flex-1">
              <div className="flex flex-1 flex-col sm:flex-row">
                <div className="p-3 lg:p-5 self-center text-center flex-1">
                  <h2 className="text-base lg:text-lg font-semibold">
                    {data.team.strong_title}
                  </h2>
                  <Separator orientation="horizontal" className="my-2" />
                  <div className="text-2xl 2xl:text-3xl font-bold truncate">
                    {formatPrice(data.team.strong_price)}
                  </div>
                </div>
                <Separator
                  orientation="vertical"
                  className="hidden sm:inline-block mx-2 my-auto max-h-24 min-w-0.4 bg-transparent bg-[radial-gradient(circle,_rgba(255,255,255,1)_0%,_rgba(0,0,0,0)_60%)]"
                />
                <Separator
                  orientation="horizontal"
                  className=" sm:hidden my-2 max-h-24 min-w-0.4 bg-transparent bg-[radial-gradient(circle,_rgba(255,255,255,1)_0%,_rgba(0,0,0,0)_60%)]"
                />
                <div className="p-3 lg:p-5 self-center text-center flex-1">
                  <h2 className="text-base lg:text-lg font-semibold">
                    {data.team.weaker_title}
                  </h2>
                  <Separator orientation="horizontal" className="my-2" />
                  <div className="text-2xl 2xl:text-3xl font-bold truncate">
                    {formatPrice(data.team.weaker_price)}
                  </div>
                </div>
              </div>
              <Separator
                orientation="vertical"
                className=" hidden xl:block mx-2 my-auto max-h-24 min-w-0.4 bg-transparent bg-[radial-gradient(circle,_rgba(255,255,255,1)_0%,_rgba(0,0,0,0)_60%)]"
              />
              <Separator
                orientation="horizontal"
                className="xl:hidden my-2 max-h-24 min-w-0.4 bg-transparent bg-[radial-gradient(circle,_rgba(255,255,255,1)_0%,_rgba(0,0,0,0)_60%)]"
              />

              <div className="flex flex-wrap flex-1 xl:flex-nowrap">
                <div className="p-3 self-center text-center flex-1">
                  <h2 className="text-sm lg:text-lg font-semibold">
                    {data.team.total_title}
                  </h2>
                  <Separator orientation="horizontal" className="my-2" />
                  <div className="text-xl 2xl:text-3xl font-bold truncate">
                    {data.team.total_direct}
                  </div>
                </div>
                <div className="p-3 self-center text-center flex-1">
                  <h2 className="text-sm lg:text-lg font-semibold">
                    {data.team.active_title}
                  </h2>
                  <Separator orientation="horizontal" className="my-2" />
                  <div className="text-xl 2xl:text-3xl font-bold truncate">
                    {data.team.active_direct}
                  </div>
                </div>
                <div className="p-3  self-center text-center flex-1">
                  <h2 className="text-sm lg:text-lg font-semibold">
                    {data.team.team_title}
                  </h2>
                  <Separator orientation="horizontal" className="my-2" />
                  <div className="text-xl 2xl:text-3xl font-bold truncate">
                    {data.team.total_team}
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}
