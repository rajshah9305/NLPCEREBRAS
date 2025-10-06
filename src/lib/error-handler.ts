/**
 * Enterprise-grade error handling for RAJ AI APP BUILDER
 * Comprehensive error management and reporting
 */

import { AppError } from '@/types';
import { logger } from './logger';

export class AppErrorHandler {
  private static instance: AppErrorHandler;
  private errorCount: Map<string, number> = new Map();
  private maxErrorsPerType = 10;

  private constructor() {}

  static getInstance(): AppErrorHandler {
    if (!AppErrorHandler.instance) {
      AppErrorHandler.instance = new AppErrorHandler();
    }
    return AppErrorHandler.instance;
  }

  /**
   * Handle and categorize errors
   */
  handleError(error: Error, context?: string): AppError {
    const appError: AppError = {
      code: this.getErrorCode(error),
      message: error.message,
      details: context,
      timestamp: new Date().toISOString(),
      stack: error.stack,
    };

    // Log the error
    logger.error('error', `Error handled: ${appError.code}`, appError);

    // Track error frequency
    this.trackError(appError.code);

    // Check if error rate is too high
    if (this.isErrorRateTooHigh(appError.code)) {
      logger.warn('error', `High error rate detected for: ${appError.code}`);
    }

    return appError;
  }

  /**
   * Handle API errors specifically
   */
  handleApiError(error: Error, endpoint: string, statusCode?: number): AppError {
    const context = `API Error - ${endpoint}${statusCode ? ` (${statusCode})` : ''}`;
    const appError = this.handleError(error, context);
    
    // Add API-specific error codes
    if (statusCode) {
      appError.code = `API_${statusCode}_${appError.code}`;
    }

    return appError;
  }

  /**
   * Handle validation errors
   */
  handleValidationError(field: string, message: string): AppError {
    const error = new Error(message);
    error.name = 'ValidationError';
    
    return this.handleError(error, `Validation failed for field: ${field}`);
  }

  /**
   * Handle generation errors
   */
  handleGenerationError(error: Error, prompt?: string): AppError {
    const context = `Generation failed${prompt ? ` for prompt: ${prompt.substring(0, 50)}...` : ''}`;
    const appError = this.handleError(error, context);
    appError.code = `GENERATION_${appError.code}`;
    
    return appError;
  }

  /**
   * Handle network errors
   */
  handleNetworkError(error: Error, url: string): AppError {
    const context = `Network error for URL: ${url}`;
    const appError = this.handleError(error, context);
    appError.code = `NETWORK_${appError.code}`;
    
    return appError;
  }

  /**
   * Get user-friendly error message
   */
  getUserFriendlyMessage(error: AppError): string {
    const errorMessages: Record<string, string> = {
      'API_401': 'Invalid API key. Please check your configuration.',
      'API_403': 'Access forbidden. Please check your API permissions.',
      'API_429': 'Rate limit exceeded. Please try again later.',
      'API_500': 'Server error. Please try again later.',
      'API_502': 'Service temporarily unavailable. Please try again later.',
      'API_503': 'Service overloaded. Please try again later.',
      'NETWORK_ERROR': 'Network connection failed. Please check your internet connection.',
      'VALIDATION_ERROR': 'Invalid input provided. Please check your input and try again.',
      'GENERATION_ERROR': 'Failed to generate code. Please try again with a different prompt.',
      'TIMEOUT_ERROR': 'Request timed out. Please try again.',
      'UNKNOWN_ERROR': 'An unexpected error occurred. Please try again.',
    };

    return errorMessages[error.code] || errorMessages['UNKNOWN_ERROR'];
  }

  /**
   * Get error code from error
   */
  private getErrorCode(error: Error): string {
    if (error.name === 'ValidationError') return 'VALIDATION_ERROR';
    if (error.name === 'TypeError') return 'TYPE_ERROR';
    if (error.name === 'ReferenceError') return 'REFERENCE_ERROR';
    if (error.name === 'SyntaxError') return 'SYNTAX_ERROR';
    if (error.message.includes('timeout')) return 'TIMEOUT_ERROR';
    if (error.message.includes('network')) return 'NETWORK_ERROR';
    if (error.message.includes('API')) return 'API_ERROR';
    if (error.message.includes('generation')) return 'GENERATION_ERROR';
    
    return 'UNKNOWN_ERROR';
  }

  /**
   * Track error frequency
   */
  private trackError(errorCode: string): void {
    const currentCount = this.errorCount.get(errorCode) || 0;
    this.errorCount.set(errorCode, currentCount + 1);
  }

  /**
   * Check if error rate is too high
   */
  private isErrorRateTooHigh(errorCode: string): boolean {
    const count = this.errorCount.get(errorCode) || 0;
    return count > this.maxErrorsPerType;
  }

  /**
   * Get error statistics
   */
  getErrorStatistics(): Record<string, number> {
    return Object.fromEntries(this.errorCount);
  }

  /**
   * Clear error statistics
   */
  clearErrorStatistics(): void {
    this.errorCount.clear();
  }

  /**
   * Check if error is recoverable
   */
  isRecoverableError(error: AppError): boolean {
    const recoverableCodes = [
      'NETWORK_ERROR',
      'TIMEOUT_ERROR',
      'API_429',
      'API_502',
      'API_503',
    ];
    
    return recoverableCodes.some(code => error.code.includes(code));
  }

  /**
   * Get retry delay for recoverable errors
   */
  getRetryDelay(error: AppError): number {
    const retryDelays: Record<string, number> = {
      'NETWORK_ERROR': 1000,
      'TIMEOUT_ERROR': 2000,
      'API_429': 5000,
      'API_502': 3000,
      'API_503': 3000,
    };

    for (const [code, delay] of Object.entries(retryDelays)) {
      if (error.code.includes(code)) {
        return delay;
      }
    }

    return 1000; // Default retry delay
  }

  /**
   * Create error boundary for React components
   */
  createErrorBoundary() {
    return {
      componentDidCatch: (error: Error, errorInfo: { componentStack: string }) => {
        const appError = this.handleError(error, `React Error Boundary: ${errorInfo.componentStack}`);
        logger.error('error', 'React component error caught', { error: appError, errorInfo });
      },
    };
  }
}

// Create singleton instance
export const errorHandler = AppErrorHandler.getInstance();

// Export error handler and types
export default errorHandler;
