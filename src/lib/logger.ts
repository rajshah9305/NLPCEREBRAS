/**
 * Enterprise-grade logging system for RAJ AI APP BUILDER
 * Comprehensive logging with multiple levels and categories
 */

import { LOGGING } from '@/constants';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  category: string;
  message: string;
  data?: unknown;
  timestamp: string;
  stack?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private formatMessage(entry: LogEntry): string {
    const { level, category, message, timestamp, data } = entry;
    const baseMessage = `[${timestamp}] [${level.toUpperCase()}] [${category}] ${message}`;
    
    if (data) {
      return `${baseMessage}\nData: ${JSON.stringify(data, null, 2)}`;
    }
    
    return baseMessage;
  }

  private shouldLog(level: LogLevel): boolean {
    const currentLevel = this.isDevelopment ? LOGGING.LEVELS.DEBUG : LOGGING.LEVELS.INFO;
    return LOGGING.LEVELS[level.toUpperCase() as keyof typeof LOGGING.LEVELS] >= currentLevel;
  }

  private log(level: LogLevel, category: string, message: string, data?: unknown): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      category,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    if (level === 'error') {
      entry.stack = new Error().stack;
    }

    const formattedMessage = this.formatMessage(entry);

    // Console logging
    switch (level) {
      case 'debug':
        console.debug(formattedMessage);
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
        break;
    }

    // In production, you might want to send logs to external services
    if (this.isProduction && level === 'error') {
      this.sendToExternalService();
    }
  }

  private sendToExternalService(): void {
    // Implement external logging service integration here
    // Examples: Sentry, LogRocket, DataDog, etc.
    try {
      // Example: Send to external service
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry),
      // });
    } catch (error: unknown) {
      console.error('Failed to send log to external service:', error);
    }
  }

  // Public logging methods
  debug(category: string, message: string, data?: unknown): void {
    this.log('debug', category, message, data);
  }

  info(category: string, message: string, data?: unknown): void {
    this.log('info', category, message, data);
  }

  warn(category: string, message: string, data?: unknown): void {
    this.log('warn', category, message, data);
  }

  error(category: string, message: string, data?: unknown): void {
    this.log('error', category, message, data);
  }

  // Specialized logging methods
  apiRequest(method: string, url: string, data?: unknown): void {
    this.info(LOGGING.CATEGORIES.API, `API Request: ${method} ${url}`, data);
  }

  apiResponse(method: string, url: string, status: number, data?: unknown): void {
    const level = status >= 400 ? 'error' : 'info';
    this.log(level, LOGGING.CATEGORIES.API, `API Response: ${method} ${url} - ${status}`, data);
  }

  performance(operation: string, duration: number, data?: unknown): void {
    this.info(LOGGING.CATEGORIES.PERFORMANCE, `Performance: ${operation} took ${duration}ms`, data);
  }

  security(event: string, data?: unknown): void {
    this.warn(LOGGING.CATEGORIES.SECURITY, `Security Event: ${event}`, data);
  }

  userAction(action: string, data?: unknown): void {
    this.info(LOGGING.CATEGORIES.UI, `User Action: ${action}`, data);
  }

  generationStart(prompt: string): void {
    this.info(LOGGING.CATEGORIES.API, 'Generation started', { prompt: prompt.substring(0, 100) });
  }

  generationComplete(duration: number, codeLength: number): void {
    this.info(LOGGING.CATEGORIES.API, 'Generation completed', { duration, codeLength });
  }

  generationError(error: Error, prompt?: string): void {
    this.error(LOGGING.CATEGORIES.API, 'Generation failed', { 
      error: error.message, 
      stack: error.stack,
      prompt: prompt?.substring(0, 100)
    });
  }
}

// Create singleton instance
export const logger = new Logger();

// Export logger instance and types
export { Logger };
export type { LogEntry };
