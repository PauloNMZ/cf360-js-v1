
import { useFavorecidos } from '@/hooks/favorecidos/useFavorecidos';
import { useFavorecidosWorkflow } from '@/hooks/favorecidos/useFavorecidosWorkflow';
import { useLancamentoFavorecidosState } from '@/hooks/favorecidos/useLancamentoFavorecidosState';
import { useLancamentoFavorecidosHandlers } from '@/hooks/favorecidos/useLancamentoFavorecidosHandlers';
import { useLancamentoFavorecidosReport } from '@/hooks/favorecidos/useLancamentoFavorecidosReport';

export const useLancamentoFavorecidosContainer = () => {
  // Favorecidos management
  const favorecidosData = useFavorecidos();

  // Local state management
  const stateData = useLancamentoFavorecidosState();

  // Workflow functionality
  const workflowData = useFavorecidosWorkflow({
    selectedFavorecidos: stateData.selectedFavorecidos,
    favorecidos: favorecidosData.filteredFavorecidos
  });

  // Report functionality
  const reportData = useLancamentoFavorecidosReport({
    selectedFavorecidos: stateData.selectedFavorecidos,
    workflow: workflowData.workflow,
    handleGenerateOnlyReport: workflowData.handleGenerateOnlyReport,
    setShowWorkflowDialog: workflowData.setShowWorkflowDialog
  });

  // Event handlers
  const handlersData = useLancamentoFavorecidosHandlers({
    selectedFavorecidos: stateData.selectedFavorecidos,
    setSelectedFavorecido: stateData.setSelectedFavorecido,
    setSelectedFavorecidos: stateData.setSelectedFavorecidos,
    setShowWorkflowDialog: workflowData.setShowWorkflowDialog
  });

  return {
    favorecidosData,
    stateData,
    workflowData,
    reportData,
    handlersData
  };
};
