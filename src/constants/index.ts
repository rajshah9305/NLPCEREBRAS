/**
 * Enterprise-grade constants for RAJ AI APP BUILDER
 * Centralized configuration and constants management
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.cerebras.ai/v1',
  ENDPOINTS: {
    CHAT_COMPLETIONS: '/chat/completions',
  },
  TIMEOUT: 60000, // 60 seconds
  RETRIES: 3,
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_HOUR: 1000,
  },
} as const;

// Generation Configuration
export const GENERATION_CONFIG = {
  MODEL: 'gpt-oss-120b',
  TEMPERATURE: 1,
  MAX_COMPLETION_TOKENS: 65536,
  TOP_P: 1,
  STREAM: true,
  REASONING_EFFORT: 'medium',
} as const;

// UI Constants
export const UI_CONFIG = {
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto',
  },
  COLORS: {
    PRIMARY: '#f97316', // Orange-500
    SECONDARY: '#ec4899', // Pink-500
    SUCCESS: '#10b981', // Emerald-500
    ERROR: '#ef4444', // Red-500
    WARNING: '#f59e0b', // Amber-500
    INFO: '#3b82f6', // Blue-500
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  },
  ANIMATIONS: {
    DURATION: {
      FAST: '150ms',
      NORMAL: '300ms',
      SLOW: '500ms',
    },
    EASING: {
      EASE: 'cubic-bezier(0.4, 0, 0.2, 1)',
      EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
      EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
      EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
} as const;

// Validation Constants
export const VALIDATION = {
  PROMPT: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 2000,
    PATTERN: /^[a-zA-Z0-9\s\.,!?\-_(){}[\]"'`~@#$%^&*+=|\\/:;<>]+$/,
  },
  CODE: {
    MAX_LENGTH: 50000,
    MIN_LENGTH: 100,
  },
  API_KEY: {
    PATTERN: /^csk-[a-zA-Z0-9]{40}$/,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  API: {
    INVALID_KEY: 'Invalid API key provided',
    RATE_LIMITED: 'Rate limit exceeded. Please try again later.',
    TIMEOUT: 'Request timed out. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    SERVER: 'Server error. Please try again later.',
  },
  VALIDATION: {
    PROMPT_REQUIRED: 'Please enter a description for your app',
    PROMPT_TOO_SHORT: 'Prompt must be at least 10 characters',
    PROMPT_TOO_LONG: 'Prompt must be less than 2000 characters',
    INVALID_CHARACTERS: 'Prompt contains invalid characters',
  },
  GENERATION: {
    FAILED: 'Failed to generate code',
    NO_RESPONSE: 'No response received from AI',
    INVALID_RESPONSE: 'Invalid response format',
    TIMEOUT: 'Generation timed out',
  },
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  GENERATION: {
    STARTED: 'Generation started',
    COMPLETED: 'App generated successfully!',
    COPIED: 'Code copied to clipboard!',
    STOPPED: 'Generation stopped',
  },
  SAVE: {
    SUCCESS: 'Code saved successfully',
  },
} as const;

// Performance Constants
export const PERFORMANCE = {
  MAX_GENERATION_TIME: 120000, // 2 minutes
  MAX_CODE_LENGTH: 50000,
  CACHE_TIMEOUT: 300000, // 5 minutes
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 1000,
} as const;

// Security Constants
export const SECURITY = {
  HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Referrer-Policy': 'origin-when-cross-origin',
  },
  CORS: {
    ORIGINS: ['http://localhost:3000', 'https://raj-ai-app-builder.vercel.app'],
    METHODS: ['GET', 'POST', 'OPTIONS'],
    HEADERS: ['Content-Type', 'Authorization'],
  },
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_ANALYTICS: process.env.NODE_ENV === 'production',
  ENABLE_LOGGING: true,
  ENABLE_CACHING: true,
  ENABLE_RATE_LIMITING: true,
  ENABLE_ERROR_REPORTING: process.env.NODE_ENV === 'production',
} as const;

// Logging Constants
export const LOGGING = {
  LEVELS: {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
  },
  CATEGORIES: {
    API: 'api',
    UI: 'ui',
    PERFORMANCE: 'performance',
    ERROR: 'error',
    SECURITY: 'security',
  },
} as const;

// Example Prompts
export const EXAMPLE_PROMPTS = [
  'Create a beautiful todo list with animations and gradient design',
  'Build a weather dashboard with cards and smooth transitions',
  'Make an interactive pricing calculator with slider controls',
  'Design a sleek contact form with validation and success state',
  'Create a modern login page with animated background',
  'Build a product card with hover effects and image carousel',
  'Design a responsive navigation bar with mobile menu',
  'Create an interactive data table with sorting and filtering',
  'Build a modern dashboard with charts and metrics',
  'Design a beautiful landing page with hero section',
] as const;

// System Information
export const SYSTEM_INFO = {
  NAME: 'RAJ AI APP BUILDER',
  VERSION: '1.0.0',
  DESCRIPTION: 'AI-powered React application generator',
  AUTHOR: 'RAJ',
  REPOSITORY: 'https://github.com/raj/raj-ai-app-builder',
  LICENSE: 'MIT',
  SUPPORTED_PLATFORMS: ['Vercel', 'Netlify', 'Railway', 'DigitalOcean'],
} as const;

