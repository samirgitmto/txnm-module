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
  browserId?: string;
}

export interface AIRecommendation {
  type: string;
  title: string;
  description: string;
  potentialSavings?: number;
  priority: string;
  actionRequired: string;
}

export interface SpendingInsights {
  spendingPatterns: string[];
  unusualTransactions: string[];
  savingsOpportunities: string[];
  categoryBreakdown: { [key: string]: number };
  behavioralInsights: string[];
  recommendations: AIRecommendation[];
  confidenceScore: number;
  generatedAt: string;
}

// ===== NEW KAFKA-BASED AI ANALYSIS MODELS =====

export type AnalysisStatusType = 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'NOT_FOUND';

export interface AnalysisStatus {
  requestId: string;
  status: AnalysisStatusType;
  progress?: string;
  progressPercentage?: number;
  processingTimeMs?: number;
  timestamp?: number;
  completed?: boolean;
  insights?: SpendingInsights;
  errorMessage?: string;
  chunksProcessed?: number;
  totalChunks?: number;
  sessionId?: string;
}

export interface AnalysisProgress {
  sessionId: string;
  hasProgress: boolean;
  status?: AnalysisStatusType;
  progress?: string;
  progressPercentage?: number;
  chunksProcessed?: number;
  totalChunks?: number;
  processingTimeMs?: number;
  timestamp?: number;
  message?: string;
}

export interface AnalysisRequest {
  requestId: string;
  sessionId: string;
  status: string;
  priority?: number;
  maxChunkSize?: number;
  delayBetweenChunks?: number;
  maxRetries?: number;
}

export interface AnalysisError {
  sessionId: string;
  hasError: boolean;
  status?: AnalysisStatusType;
  errorMessage?: string;
  processingTimeMs?: number;
  timestamp?: number;
  message?: string;
}

export interface KafkaAnalysisResponse {
  success: boolean;
  message: string;
  requestId?: string;
  sessionId?: string;
  status?: string;
  priority?: number;
  maxChunkSize?: number;
  delayBetweenChunks?: number;
  maxRetries?: number;
  data?: any;
}