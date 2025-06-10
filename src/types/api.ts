export interface AskRequest {
  message: string;
}

export interface AskResponse {
  response: string;
  error?: string;
}

export interface LogEntry {
  requestId: string;
  timestamp: string;
  message: string;
  response: string;
  feedback?: number;
}

export interface LogsResponse {
  logs: LogEntry[];
  error?: string;
}

export interface FeedbackRequest {
  requestId: string;
  actualPrice: number;
}

export interface FeedbackResponse {
  success: boolean;
  error?: string;
} 