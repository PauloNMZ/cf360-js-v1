
import { useState, useEffect } from 'react';
import { useFavorecidosWorkflowState } from './workflow/useFavorecidosWorkflowState';
import { useFavorecidosWorkflowNavigation } from './workflow/useFavorecidosWorkflowNavigation';
import { useFavorecidosWorkflowValidation } from './workflow/useFavorecidosWorkflowValidation';
import { useFavorecidosWorkflowProcessing } from './workflow/useFavorecidosWorkflowProcessing';
import { useFavorecidosWorkflowCompany } from './workflow/useFavorecidosWorkflowCompany';
import { useConvenentesData } from '@/hooks/importacao/useConvenentesData';
import { FavorecidoData } from '@/types/favorecido';

interface UseFavorecidosWorkflowProps {
  selectedFavorecidos: string[];
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
  const navigationData = useFavorecidosWorkflowNavigation({
    currentStep,
    setCurrentStep,
    setShowWorkflowDialog,
    workflow
  });

  // Validation
  const {
    handleOpenDirectorySettings,
    handleSaveDirectorySettings
  } = useFavorecidosWorkflowValidation({
    workflow
  });

  // Processing
  const {
    handleSubmitWorkflow,
    handleGenerateOnlyReport
  } = useFavorecidosWorkflowProcessing({
    workflow,
    setShowWorkflowDialog,
    selectedFavorecidos,
    favorecidos: favorecidos.filter(fav => fav.id && selectedFavorecidos.includes(fav.id)) as (FavorecidoData & { id: string })[],
    setCnabFileGenerated: () => {},
    setCnabFileName: () => {},
    handleGenerateReport: async () => {}
  });

  // Company management
  const {
    hasSelectedCompany,
    selectedCompany
  } = useFavorecidosWorkflowCompany();

  // Convenentes data
  const {
    convenentes,
    carregandoConvenentes
  } = useConvenentesData();

  // Initialize workflow when selectedFavorecidos changes
  useEffect(() => {
    if (selectedFavorecidos.length > 0) {
      updateWorkflow('favorecidos', selectedFavorecidos);
    }
  }, [selectedFavorecidos, updateWorkflow]);

  return {
    showWorkflowDialog,
    setShowWorkflowDialog,
    workflow,
    updateWorkflow,
    currentStep,
    goToNextStep: navigationData.goToNextStep,
    goToPreviousStep: navigationData.goToPreviousStep,
    getTotalSteps: navigationData.getTotalSteps,
    getDisplayStepNumber: navigationData.getDisplayStepNumber,
    getStepTitle: navigationData.getStepTitle,
    isCurrentStepValid: navigationData.isCurrentStepValid, // Agora retorna o valor boolean, não a função
    handleSubmitWorkflow,
    handleGenerateOnlyReport,
    handleOpenDirectorySettings,
    convenentes,
    carregandoConvenentes,
    hasSelectedCompany,
    selectedCompany
  };
};
