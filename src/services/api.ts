import { AskRequest, AskResponse, LogsResponse, FeedbackRequest, FeedbackResponse } from '../types/api';

const API_BASE_URL = '/api';

export const api = {
  async ask(request: AskRequest): Promise<AskResponse> {
    const response = await fetch(`${API_BASE_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return response.json();
  },

  async getLogs(): Promise<LogsResponse> {
    const response = await fetch(`${API_BASE_URL}/logs`);
    return response.json();
  },

  async sendFeedback(request: FeedbackRequest): Promise<FeedbackResponse> {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return response.json();
  },
}; 