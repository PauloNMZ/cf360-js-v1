
import { FavorecidoData } from '@/types/favorecido';
import { useQuery } from '@tanstack/react-query';
import { getConvenentes } from '@/services/convenente/convenenteService';
import { usePDFReportWithEmail } from '@/hooks/importacao/usePDFReportWithEmail';
import { useFavorecidosWorkflowState } from './workflow/useFavorecidosWorkflowState';
import { useFavorecidosWorkflowNavigation } from './workflow/useFavorecidosWorkflowNavigation';
import { useFavorecidosWorkflowProcessing } from './workflow/useFavorecidosWorkflowProcessing';
import { useFavorecidosWorkflowValidation } from './workflow/useFavorecidosWorkflowValidation';
import { useFavorecidosWorkflowCompany } from './workflow/useFavorecidosWorkflowCompany';

interface UseFavorecidosWorkflowProps {
  selectedFavorecidos: string[];
  favorecidos: Array<FavorecidoData & { id: string }>;
}

export const useFavorecidosWorkflow = ({ selectedFavorecidos, favorecidos }: UseFavorecidosWorkflowProps) => {
  // Company management
  const { hasSelectedCompany, getSelectedCompany, selectedCompany } = useFavorecidosWorkflowCompany();

  // State management
  const {
    showWorkflowDialog,
    setShowWorkflowDialog,
    showDirectoryDialog,
    setShowDirectoryDialog,
    currentStep,
    setCurrentStep,
    cnabFileGenerated,
    setCnabFileGenerated,
    cnabFileName,
    setCnabFileName,
    workflow,
    updateWorkflow
  } = useFavorecidosWorkflowState();

  // Initialize PDF report hooks
  const {
    showPDFPreviewDialog,
    setShowPDFPreviewDialog,
    reportData,
    showEmailConfigDialog,
    setShowEmailConfigDialog,
    defaultEmailMessage,
    reportDate,
    handleGenerateReport,
    handleSendEmailReport,
    handleEmailSubmit
  } = usePDFReportWithEmail();

  // Validation and directory handling
  const {
    handleOpenDirectorySettings,
    handleSaveDirectorySettings
  } = useFavorecidosWorkflowValidation({ workflow });

  // Navigation logic
  const {
    isCurrentStepValid,
    goToNextStep,
    goToPreviousStep,
    getTotalSteps,
    getDisplayStepNumber,
    getStepTitle
  } = useFavorecidosWorkflowNavigation({
    currentStep,
    setCurrentStep,
    setShowWorkflowDialog,
    workflow
  });

  // Processing logic
  const {
    handleSubmitWorkflow,
    handleGenerateOnlyReport
  } = useFavorecidosWorkflowProcessing({
    selectedFavorecidos,
    favorecidos,
    workflow,
    setShowWorkflowDialog,
    setCnabFileGenerated,
    setCnabFileName,
    handleGenerateReport
  });

  // Fetch convenentes for selection
  const { data: convenentes = [], isLoading: carregandoConvenentes } = useQuery({
    queryKey: ['convenentes'],
    queryFn: getConvenentes,
    enabled: showWorkflowDialog
  });

  return {
    // State
    showWorkflowDialog,
    setShowWorkflowDialog,
    showDirectoryDialog,
    setShowDirectoryDialog,
    currentStep,
    workflow,
    updateWorkflow,
    cnabFileGenerated,
    cnabFileName,
    
    // Company
    hasSelectedCompany,
    selectedCompany,
    
    // Navigation - returning functions directly
    isCurrentStepValid: () => isCurrentStepValid(),
    goToNextStep,
    goToPreviousStep,
    getTotalSteps,
    getDisplayStepNumber,
    getStepTitle,
    
    // Processing
    handleSubmitWorkflow,
    handleGenerateOnlyReport,
    handleOpenDirectorySettings,
    handleSaveDirectorySettings,
    
    // Data
    convenentes,
    carregandoConvenentes,
    
    // Report functionality
    showPDFPreviewDialog,
    setShowPDFPreviewDialog,
    reportData,
    showEmailConfigDialog,
    setShowEmailConfigDialog,
    defaultEmailMessage,
    reportDate,
    handleSendEmailReport,
    handleEmailSubmit
  };
};
