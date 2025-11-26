"use client";
import axios from "axios";
import React, {
  createContext,
  useEffect,
  useCallback,
  useState,
  ReactNode,
} from "react";
import { apiConfig } from "./api-config";
import { setCookie, deleteCookie, getCookie } from "cookies-next";
import { routes } from "./routes";
import { useRouter } from "next/navigation";

// Types
interface UserProfile {
  eligible: number;
  invitationUserName: string;
  level: number;
  multiQ: number;
  multiplier: number;
  remainingEarning: number;
  totalDeposit: number;
  totalEarning: number;
  walletBalance: number;
  withdrawlIncome: number;
  userResult: {
    _id: string;
    nickName: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    activeDirectReferral: number;
    activeTeamSize: number;
    cryptoAddress: string;
    directTeamBusiness: number;
    isSubscribe: boolean;
    referralCodeA: string;
    referralCodeB: string;
    status: string;
    totalEarning: string;
    totalPlanPrice: string;
    planPrice: string;
    planSubscription: boolean;
    createdAt: string;
    activationDate: string;
    invitationCode: string;
    ivtId: string;
    fxAccountBalance: number;
    fxAccountIB: string;
    fxAccountNumber: string;
    fxAccountStatus: string;
    fxAcountProfit: string;
    fxBroker: string;
    fxLevel: string;
    isBillionaire: boolean;
  };
}

interface TeamComposition {
  thisMonthBusiness: number;
  userRank: number;
  investMent: number;
  strongTeamBV: number;
  weakTeamBV: number;
  CMRV: number;
  matchBV: number;
  matchLot: number;
  team: number;
  teamA: number;
  teamB: number;
  bvTeamA: number;
  bvTeamB: number;
  directTeam: number;
  // team: Array<{
  //   id: string;
  //   name: string;
  //   status: string;
  // }>;
}

interface GlobalPlan {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface GlobalAsset {
  balance: number;
  contributionBalance: number;
  dailyTransactionLimit: number;
  dailyWithdrawLimit: number;
  incomeBalance: number;
  totalDeposit: number;
  totalFloatingBalance: number;
  totalSpent: number;
  userId: string;
  name: string;
  type: string;
  address: string;
  billionaireContribution: number;
  billionaireClubIncome: number;
}

interface RewardResult {
  rewardType: string;
  todayProfit: number;
  totalProfit: number;
}

interface DashboardData {
  combinedResults: RewardResult[];
}

export interface TeamLegData {
  ProAmount: number;
  ExpressAmount: number;
  totalteamBusiness: number;
  selfBusiness: number;
}

interface BannerData {
  id: string;
  img: string;
  title: string;
  status: boolean;
}

interface UserContextType {
  login: (token: string) => void;
  logout: () => void;
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  globalPlan: GlobalPlan | null;
  setGlobalPlan: (plan: GlobalPlan | null) => void;
  globalasset: GlobalAsset | null;
  setGlobalAsset: (asset: GlobalAsset | null) => void;
  activeTab: number;
  setActiveTab: (tab: number) => void;
  getInternalWallet: () => Promise<void>;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  userToken: string | null;
  setUserToken: (token: string | null) => void;
  monthBusiness: number;
  setMonthBusiness: (amount: number) => void;
  teamComposition: TeamComposition | null;
  setTeamComposition: (team: TeamComposition | null) => void;
  userRank: number;
  setUserRank: (rank: number) => void;
  investMent: number;
  setInvetMent: (amount: number) => void;
  dashBoardData: DashboardData | null;
  setDashBoardData: (data: DashboardData | null) => void;
  getDashBoardData: () => Promise<void>;
  teamData: { totalTeam: number; activeTeam: number } | null;
  setTeamData: (data: { totalTeam: number; activeTeam: number } | null) => void;
  teamLegData: TeamLegData | null;
  setTeamLegData: (data: TeamLegData | null) => void;
  getTeamLegView: (fromDate?: string, toDate?: string) => Promise<void>;
  getCommunityMemberDashboard: () => Promise<void>;
  bannerData: BannerData[] | null;
  getBannerData: () => Promise<void>;
}

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextType | null>(null);

export default function UserContextProvider({
  children,
}: UserContextProviderProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [teamComposition, setTeamComposition] =
    useState<TeamComposition | null>(null);
  const [monthBusiness, setMonthBusiness] = useState(0);
  const [userRank, setUserRank] = useState(0);
  const [globalPlan, setGlobalPlan] = useState<GlobalPlan | null>(null);
  const [globalasset, setGlobalAsset] = useState<GlobalAsset | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [investMent, setInvetMent] = useState(0);
  const router = useRouter();
  const [dashBoardData, setDashBoardData] = useState<DashboardData | null>(
    null
  );
  const [teamData, setTeamData] = useState<{
    totalTeam: number;
    activeTeam: number;
  } | null>(null);
  const [teamLegData, setTeamLegData] = useState<TeamLegData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [bannerData, setBannerData] = useState<BannerData[] | null>(null);
  const login = (newToken: string) => {
    //setCookie('token', newToken, { maxAge: 60 * 5 }); // 5 minute
    setCookie("token", newToken, { maxAge: 60 * 3 });
    setUserToken(newToken);
  };

  const logout = () => {
    deleteCookie("token");
    router.push(routes.login);
    setUserToken(null);
    setProfile(null);
    setGlobalPlan(null);
    setGlobalAsset(null);
    setDashBoardData(null);
    setTeamData(null);
    setTeamLegData(null);
    setTeamComposition(null);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    const refreshTokenExpiry = () => {
      const token = getCookie("token");
      if (token) {
        // Reset cookie expiry to 3 minutes from now
        setCookie("token", token, { maxAge: 60 * 3 });
      }
      // Optionally, clear and reset the timeout to avoid excessive writes
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {}, 60 * 3 * 1000);
    };

    // Listen to user activity events
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) =>
      window.addEventListener(event, refreshTokenExpiry)
    );

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, refreshTokenExpiry)
      );
      if (timeout) clearTimeout(timeout);
    };
  }, []);
  useEffect(() => {
    setMounted(true);
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (token) {
      setUserToken(token);
    }
  }, []);

  const getProfile = useCallback(async () => {
    if (!userToken) return;

    try {
      const headers = {
        "Content-Type": "application/json",
        token: userToken,
      };
      const res = await axios.get(apiConfig.profile.viewProfile, { headers });
      if (res.data.result) {
        setProfile(res.data.result);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  }, [userToken]);

  const getTeamComposition = useCallback(async () => {
    if (!userToken) return;

    try {
      const headers = {
        "Content-Type": "application/json",
        token: userToken,
      };
      const res = await axios.get(apiConfig.dashboard.teamComposition, {
        headers,
      });
      if (res.data.result) {

        //console.log(res);

        const thisMonthBusiness = res.data.result.thisMonthBusiness;
        setUserRank(res.data.result.userRank);
        setMonthBusiness(thisMonthBusiness);
        setTeamComposition(res.data.result[0]);
        setInvetMent(res.data.result.investMent);
      }
    } catch (err) {
      console.error("Error fetching team composition:", err);
    }
  }, [userToken]);

  const getBannerData = useCallback(async () => {
    if (!userToken) return;

    try {
      const headers = {
        "Content-Type": "application/json",
        token: userToken,
      };
      const res = await axios.get(apiConfig.system.getBanners, { headers });
      if (res.data.result) {
        setBannerData(res.data.result);
      }
    } catch (err) {
      console.error("Error fetching banner data:", err);
    }
  }, [userToken]);

  const getDashBoardData = useCallback(async () => {
    if (!userToken) return;

    try {
      const headers = {
        "Content-Type": "application/json",
        token: userToken,
      };
      const res = await axios.get(apiConfig.dashboard.dashBoardCount, {
        headers,
      });
      if (res.data.result) {
        //console.log(res);
        setDashBoardData(res.data.result[0]);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  }, [userToken]);

  const getTeamLegView = useCallback(
    async (fromDate?: string, toDate?: string) => {
      if (!userToken) return;

      try {
        const headers = {
          "Content-Type": "application/json",
          token: userToken,
        };
        const params: { fromDate?: string; toDate?: string } = {};
        if (fromDate) params.fromDate = fromDate;
        if (toDate) params.toDate = toDate;
        const res = await axios.get(apiConfig.team.teamLegView, {
          headers,
          params,
        });
        if (res.data.result) {
          setTeamLegData(res.data.result);
        }
      } catch (err) {
        console.error("Error fetching team leg view:", err);
      }
    },
    [userToken]
  );

  const getCommunityMemberDashboard = useCallback(async () => {
    if (!userToken) return;

    try {
      const headers = {
        "Content-Type": "application/json",
        token: userToken,
      };
      const res = await axios.get(
        apiConfig.dashboard.communityMemberdashboard,
        { headers }
      );
      if (res.data.result) {
        setTeamData({
          totalTeam: res.data.result.totalTeam || 0,
          activeTeam: res.data.result.activeTeam || 0,
        });
      }
    } catch (err) {
      console.error("Error fetching community member dashboard:", err);
    }
  }, [userToken]);

  const getInternalWallet = useCallback(async () => {
    if (!userToken) return;

    try {
      const headers = {
        "Content-Type": "application/json",
        token: userToken,
      };
      const res = await axios.get(apiConfig.assets.getInternalWallet, {
        headers,
      });
      if (res.data.result) {
        //console.log(res);
        setGlobalAsset(res.data.result);
      }
    } catch (error) {
      console.error("Error fetching internal wallet:", error);
    }
  }, [userToken]);

  // Combine all initial data fetching into a single effect
  useEffect(() => {
    if (userToken) {
      const fetchInitialData = async () => {
        await Promise.all([
          getProfile(),
          getTeamComposition(),
          getDashBoardData(),
          getTeamLegView(),
          getCommunityMemberDashboard(),
          getInternalWallet(),
          getBannerData(),
        ]);
      };
      fetchInitialData();
      //router.push(routes.dashboard);
    }else{
      router.push(routes.login);
    }
  }, [userToken]);

  const contextValue: UserContextType = {
    login,
    logout,
    profile,
    setProfile,
    globalPlan,
    setGlobalPlan,
    globalasset,
    setGlobalAsset,
    activeTab,
    setActiveTab,
    getInternalWallet,
    showSidebar,
    setShowSidebar,
    userToken: mounted ? userToken : null,
    setUserToken,
    monthBusiness,
    setMonthBusiness,
    teamComposition,
    setTeamComposition,
    userRank,
    setUserRank,
    investMent,
    setInvetMent,
    dashBoardData,
    setDashBoardData,
    getDashBoardData,
    teamData,
    setTeamData,
    teamLegData,
    setTeamLegData,
    getTeamLegView,
    getCommunityMemberDashboard,
    bannerData,
    getBannerData,
  };

  return React.createElement(
    UserContext.Provider,
    { value: contextValue },
    children
  );
}
