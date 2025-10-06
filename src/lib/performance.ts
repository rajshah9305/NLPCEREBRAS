/**
 * Enterprise-grade performance monitoring for RAJ AI APP BUILDER
 * Comprehensive performance tracking and optimization
 */

import { PerformanceMetrics } from '@/types';
import { PERFORMANCE } from '@/constants';
import { logger } from './logger';

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Monitor navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.recordNavigationTiming(entry as PerformanceNavigationTiming);
          }
        }
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);

      // Monitor resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            this.recordResourceTiming(entry as PerformanceResourceTiming);
          }
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);

      // Monitor long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordLongTask(entry as PerformanceEntry);
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    }
  }

  private recordNavigationTiming(entry: PerformanceNavigationTiming): void {
    const metrics: PerformanceMetrics = {
      generationTime: 0,
      codeLength: 0,
      tokensUsed: 0,
      memoryUsage: this.getMemoryUsage(),
      timestamp: new Date().toISOString(),
    };

    this.metrics.set('navigation', metrics);
    logger.performance('Navigation', entry.loadEventEnd - entry.fetchStart);
  }

  private recordResourceTiming(entry: PerformanceResourceTiming): void {
    const duration = entry.responseEnd - entry.requestStart;
    logger.performance(`Resource: ${entry.name}`, duration);
  }

  private recordLongTask(entry: PerformanceEntry): void {
    logger.warn('performance', `Long task detected: ${entry.duration}ms`);
  }

  private getMemoryUsage(): number {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      return memory?.usedJSHeapSize || 0;
    }
    return 0;
  }

  /**
   * Start timing an operation
   */
  startTiming(operation: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.recordMetric(operation, {
        generationTime: duration,
        codeLength: 0,
        tokensUsed: 0,
        memoryUsage: this.getMemoryUsage(),
        timestamp: new Date().toISOString(),
      });
      
      logger.performance(operation, duration);
    };
  }

  /**
   * Record a performance metric
   */
  recordMetric(operation: string, metrics: PerformanceMetrics): void {
    this.metrics.set(operation, metrics);
    
    // Check for performance issues
    if (metrics.generationTime > PERFORMANCE.MAX_GENERATION_TIME) {
      logger.warn('performance', `Slow operation detected: ${operation} took ${metrics.generationTime}ms`);
    }
    
    if (metrics.codeLength > PERFORMANCE.MAX_CODE_LENGTH) {
      logger.warn('performance', `Large code generated: ${metrics.codeLength} characters`);
    }
  }

  /**
   * Get performance metrics for an operation
   */
  getMetrics(operation: string): PerformanceMetrics | undefined {
    return this.metrics.get(operation);
  }

  /**
   * Get all performance metrics
   */
  getAllMetrics(): Map<string, PerformanceMetrics> {
    return new Map(this.metrics);
  }

  /**
   * Clear performance metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    totalOperations: number;
    averageGenerationTime: number;
    maxGenerationTime: number;
    totalCodeLength: number;
    averageMemoryUsage: number;
  } {
    const metrics = Array.from(this.metrics.values());
    
    if (metrics.length === 0) {
      return {
        totalOperations: 0,
        averageGenerationTime: 0,
        maxGenerationTime: 0,
        totalCodeLength: 0,
        averageMemoryUsage: 0,
      };
    }

    const totalGenerationTime = metrics.reduce((sum, m) => sum + m.generationTime, 0);
    const maxGenerationTime = Math.max(...metrics.map(m => m.generationTime));
    const totalCodeLength = metrics.reduce((sum, m) => sum + m.codeLength, 0);
    const totalMemoryUsage = metrics.reduce((sum, m) => sum + m.memoryUsage, 0);

    return {
      totalOperations: metrics.length,
      averageGenerationTime: totalGenerationTime / metrics.length,
      maxGenerationTime,
      totalCodeLength,
      averageMemoryUsage: totalMemoryUsage / metrics.length,
    };
  }

  /**
   * Monitor API response time
   */
  monitorApiCall<T>(apiCall: () => Promise<T>, endpoint: string): Promise<T> {
    const endTiming = this.startTiming(`API: ${endpoint}`);
    
    return apiCall()
      .then((result) => {
        endTiming();
        return result;
      })
      .catch((error) => {
        endTiming();
        logger.error('performance', `API call failed: ${endpoint}`, { error: error.message });
        throw error;
      });
  }

  /**
   * Monitor component render time
   */
  monitorRender<T>(renderFn: () => T, componentName: string): T {
    const endTiming = this.startTiming(`Render: ${componentName}`);
    const result = renderFn();
    endTiming();
    return result;
  }

  /**
   * Check if performance is within acceptable limits
   */
  isPerformanceAcceptable(): boolean {
    const summary = this.getPerformanceSummary();
    
    return (
      summary.averageGenerationTime < PERFORMANCE.MAX_GENERATION_TIME &&
      summary.totalCodeLength < PERFORMANCE.MAX_CODE_LENGTH &&
      summary.averageMemoryUsage < 100 * 1024 * 1024 // 100MB
    );
  }

  /**
   * Get performance recommendations
   */
  getPerformanceRecommendations(): string[] {
    const recommendations: string[] = [];
    const summary = this.getPerformanceSummary();
    
    if (summary.averageGenerationTime > PERFORMANCE.MAX_GENERATION_TIME) {
      recommendations.push('Consider optimizing API calls or reducing prompt complexity');
    }
    
    if (summary.totalCodeLength > PERFORMANCE.MAX_CODE_LENGTH) {
      recommendations.push('Consider breaking down large code generations into smaller chunks');
    }
    
    if (summary.averageMemoryUsage > 100 * 1024 * 1024) {
      recommendations.push('Consider implementing code cleanup and memory management');
    }
    
    return recommendations;
  }

  /**
   * Cleanup observers
   */
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export performance monitor and types
export { PerformanceMonitor };
export default performanceMonitor;
