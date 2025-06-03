
import { useState, useEffect } from 'react';
import { CNABWorkflowData } from '@/types/cnab240';
import { useNotificationModalContext } from '@/components/ui/NotificationModalProvider';
import { FavorecidoData } from '@/types/favorecido';
import { processSelectedRows } from '@/services/cnab240/cnab240Service';
import { useQuery } from '@tanstack/react-query';
import { getConvenentes } from '@/services/convenente/convenenteService';

interface UseFavorecidosWorkflowProps {
  selectedFavorecidos: string[];
  favorecidos: Array<FavorecidoData & { id: string }>;
}

export const useFavorecidosWorkflow = ({ selectedFavorecidos, favorecidos }: UseFavorecidosWorkflowProps) => {
  const { showSuccess, showInfo, showError } = useNotificationModalContext();
  
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [showDirectoryDialog, setShowDirectoryDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(3); // Start at convenente selection
  const [workflow, setWorkflow] = useState<CNABWorkflowData>({
    paymentDate: new Date(),
    serviceType: "Pagamentos Diversos",
    convenente: null,
    sendMethod: "cnab",
    outputDirectory: ''
  });

  // Fetch convenentes for selection
  const { data: convenentes = [], isLoading: carregandoConvenentes } = useQuery({
    queryKey: ['convenentes'],
    queryFn: getConvenentes,
    enabled: showWorkflowDialog
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

  // Function to check if the current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 3: // Convenente selection
        return workflow.convenente !== null;
      case 4: // Send method
        return workflow.sendMethod !== "";
      default:
        return true;
    }
  };

  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 3) {
      setCurrentStep(currentStep - 1);
    } else {
      setShowWorkflowDialog(false);
    }
  };

  // Get total steps for this workflow (convenente + method = 2 steps)
  const getTotalSteps = () => 2;

  // Get display step number (1-based)
  const getDisplayStepNumber = (step: number) => step - 2; // Adjust for starting at step 3

  // Get step title
  const getStepTitle = () => {
    switch (currentStep) {
      case 3:
        return "Selecionar Convenente";
      case 4:
        return "Método de Envio";
      default:
        return "";
    }
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

  // Function to map favorecido to expected RowData format
  const mapFavorecidoToRowData = (fav: FavorecidoData & { id: string }, index: number) => {
    // Map tipo conta: CC -> CC (Banco do Brasil), TD -> TD (outros bancos), PP -> PP (poupança)
    let tipoMapeado = fav.tipoConta;
    
    // Se for Banco do Brasil (001), manter CC ou PP
    if (fav.banco === '001' || fav.banco === '1') {
      tipoMapeado = fav.tipoConta === 'CC' ? 'CC' : 'PP';
    } else {
      // Para outros bancos, mapear CC para TD
      tipoMapeado = fav.tipoConta === 'CC' ? 'TD' : 'PP';
    }

    return {
      id: index + 1,
      NOME: fav.nome || '',
      INSCRICAO: fav.inscricao || '',
      BANCO: fav.banco || '',
      AGENCIA: fav.agencia || '',
      CONTA: fav.conta || '',
      TIPO: tipoMapeado,
      VALOR: fav.valorPadrao || 0,
      selected: true
    };
  };

  // Handle workflow submission
  const handleSubmitWorkflow = async () => {
    console.log("useFavorecidosWorkflow - handleSubmitWorkflow called");
    
    // Validate convenente is selected
    if (!workflow.convenente) {
      showError("Erro!", "É necessário selecionar um convenente para gerar o arquivo CNAB.");
      return;
    }

    setShowWorkflowDialog(false);
    
    try {
      // Get selected favorecidos data
      const selectedFavorecidosData = favorecidos.filter(fav => 
        selectedFavorecidos.includes(fav.id)
      );

      if (selectedFavorecidosData.length === 0) {
        throw new Error("Nenhum favorecido selecionado");
      }

      console.log("Selected favorecidos data:", selectedFavorecidosData);

      // Convert favorecidos to the format expected by processSelectedRows
      const rowData = selectedFavorecidosData.map((fav, index) => 
        mapFavorecidoToRowData(fav, index)
      );

      console.log("Mapped row data:", rowData);

      showInfo("Processando...", `Processando ${selectedFavorecidosData.length} favorecidos...`);
      
      // Process the favorecidos using the existing service
      const result = await processSelectedRows(workflow, rowData);
      
      if (result.success) {
        showSuccess("Sucesso!", `Arquivo gerado com sucesso: ${result.fileName || 'arquivo.rem'}`);
      }
      
    } catch (error) {
      console.error("Erro ao processar favorecidos:", error);
      showError("Erro!", error instanceof Error ? error.message : "Erro ao processar favorecidos");
    }
  };

  return {
    showWorkflowDialog,
    setShowWorkflowDialog,
    showDirectoryDialog,
    setShowDirectoryDialog,
    currentStep,
    workflow,
    updateWorkflow,
    isCurrentStepValid,
    goToNextStep,
    goToPreviousStep,
    getTotalSteps,
    getDisplayStepNumber,
    getStepTitle,
    handleOpenDirectorySettings,
    handleSaveDirectorySettings,
    handleSubmitWorkflow,
    convenentes,
    carregandoConvenentes
  };
};
