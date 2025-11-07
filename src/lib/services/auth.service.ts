import { apiConfig } from '../api-config';
import axios from 'axios';

interface User {
  id: string;
  nickName: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
  mobileNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  referralCode: string;
}

interface LoginResponse {
  result?: {
    token: string;
    user: User;
  };
  responseMessage?: string;
  status?: boolean;
}

interface SignupRequest {
  email: string;
  firstName: string;
  lastName: string;
  nickName: string;
  mobileNumber: string;
  invitationCode?: string;
}

interface SignupResponse {
  status: boolean;
  responseMessage: string;
  result?: {
    user: User;
    token: string;
  };
}

interface OtpVerifyRequest {
  email: string;
  otp: string;
  token: string;
}

interface OtpVerifyResponse {
  status: boolean;
  responseMessage: string;
  statusCode: number;
}

interface ResendOtpRequest {
  email: string;
  token: string;
}

interface ResendOtpResponse {
  status: boolean;
  responseMessage: string;
  result?: {
    token: string;
  };
}

export const authService = {
  async login(nickName: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(apiConfig.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickName, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.responseMessage || 'Login failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async signup(data: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await fetch(apiConfig.auth.signup, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.responseMessage || 'Registration failed');
      }

      return responseData;
    } catch (error) {
      throw error;
    }
  },

  otpVerify: async (data: OtpVerifyRequest): Promise<OtpVerifyResponse> => {
    const headers = {
      "Content-Type": "application/json",
      token: data.token,
    };
    const response = await axios.put(apiConfig?.auth?.otpVerify, {
      email: data.email,
      otp: data.otp
    }, { headers });
    return response.data;
  },

  resendOtp: async (data: ResendOtpRequest): Promise<ResendOtpResponse> => {
    const headers = {
      "Content-Type": "application/json",
      token: data.token,
    };
    const response = await axios.put(apiConfig?.auth?.resendOtp, {
      email: data.email
    }, { headers });
    return response.data;
  },
}; 