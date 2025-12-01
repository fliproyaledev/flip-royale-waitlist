export interface WaitlistEntry {
  id?: number;
  twitter_username: string;
  wallet_address: string;
  created_at?: Date;
}

export interface WaitlistFormData {
  twitter_username: string;
  wallet_address: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
