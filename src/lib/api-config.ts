// NEXT_PUBLIC_BASE_URL=https://uat-api.ivtrade.ai/api/v1/
// Base URLs
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// API Configuration object
export const apiConfig = {
  // Authentication & User Management
  auth: {
    signup: `${baseUrl}user/userRegister`,
    login: `${baseUrl}user/user-login`,
    otpVerify: `${baseUrl}user/userRegisterVerifyOtpEmail`,
    resendOtp: `${baseUrl}user/user-register-Send-OTP`,
    mailVerifyForgot: `${baseUrl}user/user-Forgot-verify-Otp-Email`,
    resetPassword: `${baseUrl}user/user-Forgot-Password`,
    getOtpChangeTransaction: `${baseUrl}user/user-Forgot-Password-Send-OTP`,
    verifyOtpChangeTransaction: `${baseUrl}user/forgotTransactionPasswordUpdate`,
    userChangePassword: `${baseUrl}user/modifyPassword`,
    userChangeOtpPassword: `${baseUrl}user/send-otp-change-password`,
  },

  // User Profile
  profile: {
    viewProfile: `${baseUrl}user/viewMyProfile`,
    updateProfile: `${baseUrl}user/updateProfile`,
    updateProfilePic: `${baseUrl}user/user-editUserProfilePic`,
  },

  // Trading & Plans
  trading: {
    getPlans: `${baseUrl}buy/getTradingBotDetails`,
    buyPlan: `${baseUrl}buy/buyPlanData`,
    getPlanHistory: `${baseUrl}user/get-plan-purchase-history`,
  },

  // Assets & Transactions
  assets: {
    getInternalWallet: `${baseUrl}assetsTransaction/getinternalWallet`,
    getRawReceipt: `${baseUrl}assetsTransaction/get-raw-receipt`,
    withdrawOtp: `${baseUrl}assetsTransaction/WithdrawAsset`,
    verifyOtp: `${baseUrl}assetsTransaction/verifyTransaction`,
    confirmTransaction: `${baseUrl}assetsTransaction/confirmAssetTransaction`,
    purchaseHistory: `${baseUrl}assetsTransaction/transactionHistoryForUserWithdrawDepositTransfer`,
    redeemBalance: `${baseUrl}assetsTransaction/redeem-income-wallet`,
    transferAssets: `${baseUrl}assetsTransaction/transferAsset`,
    invetmentHistory: `${baseUrl}user/fx-invetment-history`,
  },

  // Dashboard & Team
  dashboard: {
    dashBoardCount: `${baseUrl}user/get-dashboard-count`,
    teamComposition: `${baseUrl}user/get-team-composition`,
    getActivationGain: `${baseUrl}user/getActivationGain`,
    getDirectReffralTeamDashboard: `${baseUrl}user/getDirectReffralTeamDashboard`,
    communityMemberdashboard: `${baseUrl}user/communityMemberdashboard`,
    getFeeRewards: `${baseUrl}user/get-fee-reward`,
  },

  // Team Management
  team: {
    teamList: `${baseUrl}user/fetch-child-tree`,
    teamListTab: `${baseUrl}user/my-team-list`,
    teamListView: `${baseUrl}user/my-team-view-list`,
    teamLegView: `${baseUrl}user/team-leg-view`,
    teamDividentHistory: `${baseUrl}user/get-team-devidend-history`,
    teamDividentHistoryDate: `${baseUrl}user/get-team-devidend-history-by-date`,
  },

  // Predictions
//   prediction: {
//     participateInPrediction: `${predictionUrl}pool/participate`,
//     historyOfPrediction: `${predictionUrl}pool/get-my-prediction-history`,
//     myPrediction: `${predictionUrl}pool/get-my-prediction-revenu`,
//   },

  // Rewards
  rewards: {
    getRewardData: `${baseUrl}user/get-matching-reward-data`,
    claimReward: `${baseUrl}user/claim-matching-reward`,
    verifyRewardClaim: `${baseUrl}user/verify-claim-matching-reward`,
  },

  // System
  system: {
    siteMaintainence: `${baseUrl}admin/get-settings`,
    getBanners: `${baseUrl}banner/get-all-banners-of-web`,
  },

  support: {
    addFeedback: `${baseUrl}contactUs/addFeedback`,
    getFeedbackList: `${baseUrl}contactUs/feedbackListforWeb`,
  }
};