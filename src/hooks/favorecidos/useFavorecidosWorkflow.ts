
import { useState, useEffect } from 'react';
import { CNABWorkflowData } from '@/types/cnab240';
import { useNotificationModalContext } from '@/components/ui/NotificationModalProvider';
import { FavorecidoData } from '@/types/favorecido';
import { processSelectedRows } from '@/services/cnab240/cnab240Service';

interface UseFavorecidosWorkflowProps {
  selectedFavorecidos: string[];
  favorecidos: Array<FavorecidoData & { id: string }>;
}

export const useFavorecidosWorkflow = ({ selectedFavorecidos, favorecidos }: UseFavorecidosWorkflowProps) => {
  const { showSuccess, showInfo } = useNotificationModalContext();
  
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [showDirectoryDialog, setShowDirectoryDialog] = useState(false);
  const [workflow, setWorkflow] = useState<CNABWorkflowData>({
    paymentDate: new Date(),
    serviceType: "Pagamentos Diversos",
    convenente: null,
    sendMethod: "cnab",
    outputDirectory: ''
  });

  // Initialize workflow with saved directory
  useEffect(() => {
    const savedDirectory = localStorage.getItem('cnab240OutputDirectory') || '';
    setWorkflow(prev => ({
      ...prev,
      outputDirectory: savedDirectory
    }));
  }, []);

  // Function to update workflow data
  const updateWorkflow = (field: keyof CNABWorkflowData, value: any) => {
    console.log("useFavorecidosWorkflow - updateWorkflow:", { field, value });
    setWorkflow(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to check if the current step is valid (only step 4 - send method)
  const isCurrentStepValid = () => {
    return workflow.sendMethod !== "";
  };

  // Handle opening directory settings dialog
  const handleOpenDirectorySettings = () => {
    setShowDirectoryDialog(true);
  };

  // Handle saving directory settings
  const handleSaveDirectorySettings = () => {
    localStorage.setItem('cnab240OutputDirectory', workflow.outputDirectory || '');
    setShowDirectoryDialog(false);
  };

  // Handle workflow submission
  const handleSubmitWorkflow = async () => {
    setShowWorkflowDialog(false);
    
    try {
      // Get selected favorecidos data
      const selectedFavorecidosData = favorecidos.filter(fav => 
        selectedFavorecidos.includes(fav.id)
      );

      if (selectedFavorecidosData.length === 0) {
        throw new Error("Nenhum favorecido selecionado");
      }

      // Convert favorecidos to the format expected by processSelectedRows
      const rowData = selectedFavorecidosData.map((fav, index) => ({
        id: index + 1,
        NOME: fav.nome,
        INSCRICAO: fav.inscricao,
        BANCO: fav.banco,
        AGENCIA: fav.agencia,
        CONTA: fav.conta,
        TIPO: fav.tipoConta,
        VALOR: fav.valorPadrao,
        selected: true
      }));

      showInfo("Processando...", `Processando ${selectedFavorecidosData.length} favorecidos...`);
      
      // Process the favorecidos using the existing service
      const result = await processSelectedRows(workflow, rowData);
      
      if (result.success) {
        showSuccess("Sucesso!", `Arquivo gerado com sucesso: ${result.fileName || 'arquivo.rem'}`);
      }
      
    } catch (error) {
      console.error("Erro ao processar favorecidos:", error);
    }
  };

  return {
    showWorkflowDialog,
    setShowWorkflowDialog,
    showDirectoryDialog,
    setShowDirectoryDialog,
    workflow,
    updateWorkflow,
    isCurrentStepValid,
    handleOpenDirectorySettings,
    handleSaveDirectorySettings,
    handleSubmitWorkflow
  };
};
