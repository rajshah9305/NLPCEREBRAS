/**
 * Enterprise-grade type definitions for RAJ AI APP BUILDER
 * Comprehensive type safety for all application components
 */

// API Response Types
export interface CerebrasChunk {
  choices: Array<{
    delta: {
      content?: string;
    };
    finish_reason?: string;
  }>;
}

export interface GenerationRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface GenerationResponse {
  stage: 'code' | 'done' | 'error';
  content?: string;
  error?: string;
  timestamp?: string;
}

// Application State Types
export interface AppState {
  prompt: string;
  generatedCode: string;
  isGenerating: boolean;
  showPreview: boolean;
  error: string | null;
}

export interface GenerationConfig {
  model: string;
  temperature: number;
  maxCompletionTokens: number;
  stream: boolean;
  reasoningEffort: string;
}

// Component Props Types
export interface SandpackPreviewProps {
  code: string;
  theme?: 'light' | 'dark';
  showEditor?: boolean;
  showConsole?: boolean;
}

export interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  placeholder?: string;
}

export interface CodeDisplayProps {
  code: string;
  isGenerating: boolean;
  error: string | null;
  onCopy: () => void;
  onStop?: () => void;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: string;
  timestamp: string;
  stack?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// API Configuration Types
export interface APIConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
}

export interface EnvironmentConfig {
  cerebrasApiKey: string;
  nodeEnv: 'development' | 'production' | 'test';
  appUrl: string;
  apiUrl: string;
}

// Utility Types
export type Status = 'idle' | 'loading' | 'success' | 'error';

export type Theme = 'light' | 'dark' | 'auto';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Event Types
export interface GenerationEvent {
  type: 'start' | 'progress' | 'complete' | 'error';
  data: unknown;
  timestamp: string;
}

export interface UserEvent {
  type: 'click' | 'input' | 'focus' | 'blur';
  element: string;
  data?: unknown;
  timestamp: string;
}

// Performance Types
export interface PerformanceMetrics {
  generationTime: number;
  codeLength: number;
  tokensUsed: number;
  memoryUsage: number;
  timestamp: string;
}

// Security Types
export interface SecurityHeaders {
  'X-Content-Type-Options': string;
  'X-Frame-Options': string;
  'X-XSS-Protection': string;
  'Strict-Transport-Security': string;
  'Referrer-Policy': string;
}

// Configuration Types
export interface AppConfig {
  api: APIConfig;
  environment: EnvironmentConfig;
  security: SecurityHeaders;
  performance: {
    maxGenerationTime: number;
    maxCodeLength: number;
    cacheTimeout: number;
  };
}

