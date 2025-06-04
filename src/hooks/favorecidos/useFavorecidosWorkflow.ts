
import { useState, useEffect } from 'react';
import { useFavorecidosWorkflowState } from './workflow/useFavorecidosWorkflowState';
import { useFavorecidosWorkflowNavigation } from './workflow/useFavorecidosWorkflowNavigation';
import { useFavorecidosWorkflowValidation } from './workflow/useFavorecidosWorkflowValidation';
import { useFavorecidosWorkflowProcessing } from './workflow/useFavorecidosWorkflowProcessing';
import { useFavorecidosWorkflowCompany } from './workflow/useFavorecidosWorkflowCompany';
import { FavorecidoData } from '@/types/favorecido';

interface UseFavorecidosWorkflowProps {
  selectedFavorecidos: FavorecidoData[];
  favorecidos: FavorecidoData[];
}

export const useFavorecidosWorkflow = ({ selectedFavorecidos, favorecidos }: UseFavorecidosWorkflowProps) => {
  // State management
  const {
    showWorkflowDialog,
    setShowWorkflowDialog,
    workflow,
    updateWorkflow,
    currentStep,
    setCurrentStep
  } = useFavorecidosWorkflowState();

  // Navigation
  const {
    goToNextStep,
    goToPreviousStep,
    getTotalSteps,
    getDisplayStepNumber,
    getStepTitle
  } = useFavorecidosWorkflowNavigation({
    currentStep,
    setCurrentStep,
    workflow
  });

  // Validation
  const { isCurrentStepValid } = useFavorecidosWorkflowValidation({
    currentStep,
    workflow
  });

  // Processing
  const {
    handleSubmitWorkflow,
    handleGenerateOnlyReport,
    handleOpenDirectorySettings
  } = useFavorecidosWorkflowProcessing({
    workflow,
    setShowWorkflowDialog,
    selectedFavorecidos,
    favorecidos
  });

  // Company management
  const {
    convenentes,
    carregandoConvenentes,
    hasSelectedCompany,
    selectedCompany
  } = useFavorecidosWorkflowCompany({ workflow });

  // Initialize workflow when selectedFavorecidos changes
  useEffect(() => {
    if (selectedFavorecidos.length > 0) {
      updateWorkflow({
        ...workflow,
        favorecidos: selectedFavorecidos
      });
    }
  }, [selectedFavorecidos]);

  return {
    showWorkflowDialog,
    setShowWorkflowDialog,
    workflow,
    updateWorkflow,
    currentStep,
    goToNextStep,
    goToPreviousStep,
    getTotalSteps,
    getDisplayStepNumber,
    getStepTitle,
    isCurrentStepValid: isCurrentStepValid(), // Call the function here to return boolean
    handleSubmitWorkflow,
    handleGenerateOnlyReport,
    handleOpenDirectorySettings,
    convenentes,
    carregandoConvenentes,
    hasSelectedCompany,
    selectedCompany
  };
};
