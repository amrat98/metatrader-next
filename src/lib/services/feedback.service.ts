import { apiConfig } from '../api-config';
import axios from 'axios';

export interface AddFeedbackRequest {
  feedbackType: string;
  description: string;
  file?: File | null;
  flowType?: string;
  issueType: string;
  screenshot?: string;
}

export interface AddFeedbackResponse {
  status: boolean;
  responseMessage: string;
  result?: any;
}

export interface FeedbackListResponse {
  status: boolean;
  responseMessage: string;
  result?: any;
}

export const feedbackService = {
  async addFeedback(data: AddFeedbackRequest, token: string): Promise<AddFeedbackResponse> {
    // The API expects a 'screenshot' field for the base64 string, not 'base64'.
    const payload: AddFeedbackRequest = {
      feedbackType: data.feedbackType,
      description: data.description,
      flowType: data.flowType,
      issueType: data.issueType,
    };
    if (data.screenshot) {
      payload.screenshot = data.screenshot;
    }
    const headers = {
      'Content-Type': 'application/json',
      token,
    };
    const response = await axios.post(apiConfig.support.addFeedback, payload, { headers });
    return response.data;
  },

  async getFeedbackList(token: string, page = 1, limit = 20): Promise<FeedbackListResponse> {
    const headers = {
      'Content-Type': 'application/json',
      token,
    };
    const params = { page, limit };
    const response = await axios.get(apiConfig.support.getFeedbackList, { headers, params });
    return response.data;
  },
}; 