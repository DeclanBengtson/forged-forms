'use client';

import React, { ErrorInfo } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { log } from '@/lib/logger';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

// Generic error fallback component
function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Something went wrong
            </h3>
          </div>
        </div>
        <div className="text-sm text-red-700 mb-4">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </div>
        <div className="flex space-x-3">
          <button
            onClick={resetErrorBoundary}
            className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            Reload page
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4">
            <summary className="text-sm text-red-600 cursor-pointer">
              Error details (development only)
            </summary>
            <pre className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto">
              {error.message}
              {error.stack && '\n\n' + error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

// Minimal error fallback for smaller components
function MinimalErrorFallback({ error: _error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded">
      <p className="text-sm text-red-600 mb-2">Error loading component</p>
      <button
        onClick={resetErrorBoundary}
        className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded"
      >
        Retry
      </button>
    </div>
  );
}

// Error handler function
function handleError(error: Error, errorInfo: ErrorInfo) {
  // Log error with structured logging
  log.error('React Error Boundary caught an error', {
    error: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack || 'unknown',
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'unknown',
  });

  // In production, you might want to send this to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to error tracking service (e.g., Sentry)
    // Sentry.captureException(error, { extra: errorInfo });
  }
}

// Main Error Boundary component
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onReset?: () => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
  isolate?: boolean;
}

export function ErrorBoundary({
  children,
  fallback: FallbackComponent = ErrorFallback,
  onReset,
  resetKeys,
}: Omit<ErrorBoundaryProps, 'resetOnPropsChange' | 'isolate'>) {
  return (
    <ReactErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={handleError}
      onReset={onReset}
      resetKeys={resetKeys}
    >
      {children}
    </ReactErrorBoundary>
  );
}

// Specialized error boundaries for different contexts

// For dashboard components
export function DashboardErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error: _error, resetErrorBoundary }) => (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Dashboard Error
          </h3>
          <p className="text-sm text-red-600 mb-4">
            There was an error loading your dashboard. Please try refreshing the page.
          </p>
          <button
            onClick={resetErrorBoundary}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Retry
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

// For form components
export function FormErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error: _error, resetErrorBoundary }) => (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h4 className="text-sm font-medium text-red-800 mb-2">
            Form Error
          </h4>
          <p className="text-xs text-red-600 mb-3">
            There was an error with this form. Please try again.
          </p>
          <button
            onClick={resetErrorBoundary}
            className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-xs"
          >
            Retry
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

// For chart/analytics components
export function ChartErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={MinimalErrorFallback}
    >
      {children}
    </ErrorBoundary>
  );
}

// Higher-order component for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Hook for manually triggering error boundaries
export function useErrorHandler() {
  return (error: Error, errorInfo?: { componentStack?: string }) => {
    handleError(error, { componentStack: errorInfo?.componentStack || '' });
    throw error; // Re-throw to trigger error boundary
  };
} 