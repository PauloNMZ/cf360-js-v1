
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

interface FavorecidosWorkflowReturn {
  showWorkflowDialog: boolean;
  setShowWorkflowDialog: (show: boolean) => void;
  workflow: any;
  updateWorkflow: (field: string, value: any) => void;
  currentStep: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  getTotalSteps: () => number;
  getDisplayStepNumber: (step: number) => number;
  getStepTitle: (step: number) => string;
  isCurrentStepValid: boolean;
  handleSubmitWorkflow: () => void;
  handleGenerateOnlyReport: () => void;
  handleOpenDirectorySettings: () => void;
  convenentes: any[];
  carregandoConvenentes: boolean;
  hasSelectedCompany: boolean;
  selectedCompany: any;
}

export const useFavorecidosWorkflow = ({ selectedFavorecidos, favorecidos }: UseFavorecidosWorkflowProps): FavorecidosWorkflowReturn => {
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
    handleSubmitWorkflow: originalHandleSubmitWorkflow,
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

  // Wrapper para handleSubmitWorkflow com logs de debug
  const handleSubmitWorkflow = () => {
    console.log("🚀 useFavorecidosWorkflow - handleSubmitWorkflow called");
    console.log("Current workflow state:", workflow);
    console.log("Selected favorecidos:", selectedFavorecidos);
    console.log("Current step:", currentStep);
    console.log("Is current step valid:", navigationData.isCurrentStepValid);
    
    if (!navigationData.isCurrentStepValid) {
      console.log("❌ Current step is not valid, cannot proceed");
      return;
    }
    
    console.log("✅ Calling original handleSubmitWorkflow");
    originalHandleSubmitWorkflow();
  };

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
    isCurrentStepValid: navigationData.isCurrentStepValid, // CORRIGIDO: Retorna o valor boolean diretamente
    handleSubmitWorkflow,
    handleGenerateOnlyReport,
    handleOpenDirectorySettings,
    convenentes,
    carregandoConvenentes,
    hasSelectedCompany,
    selectedCompany
  };
};
