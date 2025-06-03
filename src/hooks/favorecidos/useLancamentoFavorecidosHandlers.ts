
interface UseLancamentoFavorecidosHandlersProps {
  selectedFavorecidos: string[];
  setSelectedFavorecido: (favorecido: any) => void;
  setSelectedFavorecidos: (favorecidos: string[]) => void;
  setShowWorkflowDialog: (show: boolean) => void;
}

export const useLancamentoFavorecidosHandlers = ({
  selectedFavorecidos,
  setSelectedFavorecido,
  setSelectedFavorecidos,
  setShowWorkflowDialog
}: UseLancamentoFavorecidosHandlersProps) => {
  
  const handleSelectFavorecido = (favorecido: any) => {
    setSelectedFavorecido(favorecido);
  };

  const handleCancelSelection = () => {
    setSelectedFavorecido(null);
  };

  const handleSelectionChange = (newSelection: string[]) => {
    setSelectedFavorecidos(newSelection);
  };

  const handleProcessSelected = () => {
    if (selectedFavorecidos.length > 0) {
      setShowWorkflowDialog(true);
    }
  };

  return {
    handleSelectFavorecido,
    handleCancelSelection,
    handleSelectionChange,
    handleProcessSelected
  };
};
