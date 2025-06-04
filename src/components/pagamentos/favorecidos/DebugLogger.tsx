
import React, { useEffect } from 'react';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface DebugLoggerProps {
  currentStep: number;
  workflow: any;
  isCurrentStepValid: boolean;
  selectedFavorecidos: string[];
}

const DebugLogger: React.FC<DebugLoggerProps> = ({
  currentStep,
  workflow,
  isCurrentStepValid,
  selectedFavorecidos
}) => {
  const { handleError } = useErrorHandler();

  // Debug: log workflow state changes
  useEffect(() => {
    try {
      console.log("Workflow state changed:", {
        currentStep,
        workflow,
        isCurrentStepValid
      });
    } catch (error) {
      handleError(error, {
        component: 'DebugLogger',
        file: 'DebugLogger.tsx',
        action: 'logWorkflowState'
      });
    }
  }, [currentStep, workflow, isCurrentStepValid, handleError]);

  // Debug: log selected favorecidos
  useEffect(() => {
    console.log("Selected favorecidos changed:", selectedFavorecidos);
  }, [selectedFavorecidos]);

  return null; // This component doesn't render anything
};

export default DebugLogger;
