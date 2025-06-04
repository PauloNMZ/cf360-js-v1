
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { LovableError } from '@/types/error';
import { generateErrorId, createLovableError } from '@/utils/errorUtils';
import ErrorDisplay from './ErrorDisplay';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: LovableError | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    const lovableError = createLovableError({
      message: error.message,
      code: 'REACT_ERROR',
      stackTrace: error.stack,
      context: {
        component: 'ErrorBoundary',
        file: 'Unknown',
      },
      category: 'runtime',
      severity: 'high'
    });

    return { hasError: true, error: lovableError };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log error to external service if needed
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // Implementation for logging to external service
    console.log('Logging error to service:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback || (
        <ErrorDisplay 
          error={this.state.error} 
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
