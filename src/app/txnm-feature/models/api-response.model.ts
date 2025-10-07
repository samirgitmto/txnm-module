export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Transaction {
  tId: number;
  date: string;
  reference: string;
  credit?: number;
  debit?: number;
  balance: number;
  bankName: string;
}

export interface BankConfig {
  name: string;
  keyFormat: string;
  keyHint: string;
  keyPlaceholder: string;
}

export interface SessionInfo {
  sessionId: string;
  userType: 'GUEST' | 'REGISTERED';
  email?: string;
  fullName?: string;
  expiry: number;
}
