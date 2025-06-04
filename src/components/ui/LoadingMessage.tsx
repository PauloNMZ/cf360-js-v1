
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface LoadingMessageProps {
  isLoading: boolean;
  error?: string | null;
  loadingMessage?: string;
  onRetry?: () => void;
  className?: string;
}

const LoadingMessage: React.FC<LoadingMessageProps> = ({
  isLoading,
  error,
  loadingMessage = 'Carregando empresas',
  onRetry,
  className = ''
}) => {
  const [dots, setDots] = useState('');

  // Animate loading dots
  useEffect(() => {
    if (!isLoading) {
      setDots('');
      return;
    }

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <div className="flex items-center justify-center mb-2">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
        <p className="text-sm text-gray-500">
          {loadingMessage}{dots}
        </p>
      </div>
    );
  }

  return null;
};

export default LoadingMessage;
