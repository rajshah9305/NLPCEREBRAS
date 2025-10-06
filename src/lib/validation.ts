/**
 * Enterprise-grade validation utilities for RAJ AI APP BUILDER
 * Comprehensive input validation and sanitization
 */

import { VALIDATION, ERROR_MESSAGES } from '@/constants';

export class ValidationError extends Error {
  public readonly field: string;
  public readonly code: string;

  constructor(field: string, message: string, code: string) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = code;
  }
}

export class Validator {
  /**
   * Validate user prompt input
   */
  static validatePrompt(prompt: string): void {
    if (!prompt || typeof prompt !== 'string') {
      throw new ValidationError(
        'prompt',
        ERROR_MESSAGES.VALIDATION.PROMPT_REQUIRED,
        'PROMPT_REQUIRED'
      );
    }

    if (prompt.length < VALIDATION.PROMPT.MIN_LENGTH) {
      throw new ValidationError(
        'prompt',
        ERROR_MESSAGES.VALIDATION.PROMPT_TOO_SHORT,
        'PROMPT_TOO_SHORT'
      );
    }

    if (prompt.length > VALIDATION.PROMPT.MAX_LENGTH) {
      throw new ValidationError(
        'prompt',
        ERROR_MESSAGES.VALIDATION.PROMPT_TOO_LONG,
        'PROMPT_TOO_LONG'
      );
    }

    if (!VALIDATION.PROMPT.PATTERN.test(prompt)) {
      throw new ValidationError(
        'prompt',
        ERROR_MESSAGES.VALIDATION.INVALID_CHARACTERS,
        'INVALID_CHARACTERS'
      );
    }
  }

  /**
   * Validate API key format
   */
  static validateApiKey(apiKey: string): void {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new ValidationError(
        'apiKey',
        ERROR_MESSAGES.API.INVALID_KEY,
        'API_KEY_REQUIRED'
      );
    }

    if (!VALIDATION.API_KEY.PATTERN.test(apiKey)) {
      throw new ValidationError(
        'apiKey',
        ERROR_MESSAGES.API.INVALID_KEY,
        'INVALID_API_KEY_FORMAT'
      );
    }
  }

  /**
   * Validate generated code
   */
  static validateCode(code: string): void {
    if (!code || typeof code !== 'string') {
      throw new ValidationError(
        'code',
        'Generated code is required',
        'CODE_REQUIRED'
      );
    }

    if (code.length < VALIDATION.CODE.MIN_LENGTH) {
      throw new ValidationError(
        'code',
        'Generated code is too short',
        'CODE_TOO_SHORT'
      );
    }

    if (code.length > VALIDATION.CODE.MAX_LENGTH) {
      throw new ValidationError(
        'code',
        'Generated code is too long',
        'CODE_TOO_LONG'
      );
    }
  }

  /**
   * Sanitize user input
   */
  static sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .substring(0, VALIDATION.PROMPT.MAX_LENGTH);
  }

  /**
   * Validate environment variables
   */
  static validateEnvironment(): void {
    const requiredEnvVars = ['CEREBRAS_API_KEY'];
    
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new ValidationError(
          envVar,
          `Environment variable ${envVar} is required`,
          'MISSING_ENV_VAR'
        );
      }
    }

    // Validate API key format if present
    if (process.env.CEREBRAS_API_KEY) {
      this.validateApiKey(process.env.CEREBRAS_API_KEY);
    }
  }

  /**
   * Validate request headers
   */
  static validateHeaders(headers: Headers): void {
    const contentType = headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new ValidationError(
        'content-type',
        'Content-Type must be application/json',
        'INVALID_CONTENT_TYPE'
      );
    }
  }

  /**
   * Validate rate limiting
   */
  static validateRateLimit(requests: number, timeWindow: number): boolean {
    const maxRequests = 60; // requests per minute
    const windowMs = 60000; // 1 minute
    
    if (timeWindow > windowMs) {
      return false; // Reset window
    }
    
    return requests <= maxRequests;
  }

  /**
   * Validate file size (for future file upload features)
   */
  static validateFileSize(size: number, maxSize: number = 10 * 1024 * 1024): void {
    if (size > maxSize) {
      throw new ValidationError(
        'file',
        `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`,
        'FILE_TOO_LARGE'
      );
    }
  }

  /**
   * Validate URL format
   */
  static validateUrl(url: string): void {
    try {
      new URL(url);
    } catch {
      throw new ValidationError(
        'url',
        'Invalid URL format',
        'INVALID_URL'
      );
    }
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string): void {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      throw new ValidationError(
        'email',
        'Invalid email format',
        'INVALID_EMAIL'
      );
    }
  }

  /**
   * Validate phone number format
   */
  static validatePhone(phone: string): void {
    const phonePattern = /^\+?[\d\s\-\(\)]+$/;
    if (!phonePattern.test(phone)) {
      throw new ValidationError(
        'phone',
        'Invalid phone number format',
        'INVALID_PHONE'
      );
    }
  }
}

// Export validation utilities
export default Validator;
