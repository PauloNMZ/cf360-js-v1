
import { useState, useCallback } from 'react';
import { LovableError } from '@/types/error';
import { createLovableError, validateErrorObject, analyzeTypeScriptError } from '@/utils/errorUtils';
import { useNotificationModalContext } from '@/components/ui/NotificationModalProvider';

export const useErrorHandler = () => {
  const [errors, setErrors] = useState<LovableError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showWarning } = useNotificationModalContext();

  const handleError = useCallback((error: any, context?: any) => {
    try {
      setIsLoading(true);
      
      let lovableError: LovableError;

      // If it's already a LovableError
      if (validateErrorObject(error)) {
        lovableError = error as LovableError;
      } 
      // If it's a JavaScript Error
      else if (error instanceof Error) {
        lovableError = createLovableError({
          message: error.message,
          code: 'JS_ERROR',
          stackTrace: error.stack,
          context: {
            component: context?.component || 'Unknown',
            file: context?.file || 'Unknown',
            line: context?.line,
            column: context?.column
          },
          category: 'runtime',
          severity: 'high'
        });
      }
      // If it's a TypeScript error (string)
      else if (typeof error === 'string' && error.includes('TS')) {
        lovableError = analyzeTypeScriptError(error, context || {});
      }
      // Generic error
      else {
        lovableError = createLovableError({
          message: typeof error === 'string' ? error : 'Erro desconhecido',
          code: 'UNKNOWN_ERROR',
          context: {
            component: context?.component || 'Unknown',
            file: context?.file || 'Unknown'
          },
          category: 'runtime',
          severity: 'medium'
        });
      }

      // Add to errors list
      setErrors(prev => [lovableError, ...prev.slice(0, 49)]); // Keep last 50 errors

      // Show notification based on severity
      if (lovableError.severity === 'critical' || lovableError.severity === 'high') {
        showError('Erro Crítico!', lovableError.message);
      } else if (lovableError.severity === 'medium') {
        showWarning('Atenção!', lovableError.message);
      }

      console.error('LovableError handled:', lovableError);
      
      return lovableError;
    } catch (handlerError) {
      console.error('Error in error handler:', handlerError);
      showError('Erro no Sistema!', 'Falha ao processar erro');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [showError, showWarning]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const clearError = useCallback((errorId: string) => {
    setErrors(prev => prev.filter(err => err.id !== errorId));
  }, []);

  const getErrorsByCategory = useCallback((category: LovableError['category']) => {
    return errors.filter(err => err.category === category);
  }, [errors]);

  const getErrorsBySeverity = useCallback((severity: LovableError['severity']) => {
    return errors.filter(err => err.severity === severity);
  }, [errors]);

  return {
    errors,
    isLoading,
    handleError,
    clearErrors,
    clearError,
    getErrorsByCategory,
    getErrorsBySeverity,
    hasErrors: errors.length > 0,
    criticalErrors: getErrorsBySeverity('critical'),
    highErrors: getErrorsBySeverity('high')
  };
};
