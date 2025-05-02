
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { toast } from '@/components/ui/sonner';
import { CNABWorkflowData, Favorecido } from '@/types/cnab240';
import { downloadCNABFile } from '@/services/cnab240/index';
import { getConvenentes } from '@/services/convenenteService';
import { PlanilhaData, RowData, EXPECTED_HEADERS } from '@/types/importacao';

export const useImportacao = () => {
  // Original state for file handling
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [planilhaData, setPlanilhaData] = useState<PlanilhaData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tableData, setTableData] = useState<RowData[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [total, setTotal] = useState<number>(0);
  
  // New state for multi-step workflow
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [showDirectoryDialog, setShowDirectoryDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [workflow, setWorkflow] = useState<CNABWorkflowData>({
    paymentDate: undefined,
    serviceType: "Pagamentos Diversos",
    convenente: null,
    sendMethod: "cnab",
    outputDirectory: ''
  });

  // Estado para armazenar os convenentes reais do banco de dados
  const [convenentes, setConvenentes] = useState<Array<any>>([]);
  const [carregandoConvenentes, setCarregandoConvenentes] = useState(false);
  
  // Carregar convenentes do banco de dados
  useEffect(() => {
    const loadConvenentes = async () => {
      try {
        setCarregandoConvenentes(true);
        const data = await getConvenentes();
        console.log("Convenentes carregados:", data);
        setConvenentes(data);
      } catch (error) {
        console.error("Erro ao carregar convenentes:", error);
        toast.error("Erro ao carregar convenentes");
      } finally {
        setCarregandoConvenentes(false);
      }
    };
    
    loadConvenentes();
  }, []);
  
  // Load directory settings on component mount
  useEffect(() => {
    const savedDirectory = localStorage.getItem('cnab240OutputDirectory') || '';
    setWorkflow(prev => ({
      ...prev,
      outputDirectory: savedDirectory
    }));
  }, []);
  
  // Calculate total of "VALOR" column for selected rows
  useEffect(() => {
    if (tableData.length > 0) {
      const selectedRows = tableData.filter(row => row.selected);
      let sum = 0;
      
      for (const row of selectedRows) {
        // Convert string value to number, handle currency format
        if (row.VALOR) {
          const valueStr = row.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.');
          const value = parseFloat(valueStr);
          if (!isNaN(value)) {
            sum += value;
          }
        }
      }
      
      setTotal(sum);
    } else {
      setTotal(0);
    }
  }, [tableData]);
  
  // File handling functions
  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setErrorMessage(null);
      validateFile(files[0]);
    } else {
      setFile(null);
      setPlanilhaData(null);
    }
  };

  const validateFile = async (file: File) => {
    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

      // Check if there's data and headers
      if (jsonData.length === 0) {
        setErrorMessage("A planilha está vazia.");
        setPlanilhaData(null);
        setLoading(false);
        return;
      }

      // Get the headers from the first row
      const headers = (jsonData[0] as string[]).map(header => 
        header ? header.toString().trim().toUpperCase() : ''
      );

      // Validate headers against expected headers
      const missingColumns = EXPECTED_HEADERS.filter(
        header => !headers.includes(header)
      );
      
      const extraColumns = headers.filter(
        header => header && !EXPECTED_HEADERS.includes(header)
      );

      const isValid = missingColumns.length === 0;

      if (!isValid) {
        setErrorMessage(`A planilha não contém todas as colunas necessárias. Faltando: ${missingColumns.join(', ')}`);
      } else {
        setErrorMessage(null);
      }

      // Get the data rows (skip the header row)
      const rows = jsonData.slice(1).map((row, index) => {
        const obj: Record<string, any> = { id: index, selected: false };
        (row as any[]).forEach((cell, idx) => {
          if (headers[idx]) {
            obj[headers[idx]] = cell;
          }
        });
        return obj as RowData;
      });

      setPlanilhaData({
        headers,
        rows,
        isValid,
        missingColumns,
        extraColumns
      });

      // Initialize tableData with selected property for each row
      setTableData(rows);

      if (isValid) {
        toast.success("Planilha validada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao processar planilha:", error);
      setErrorMessage("Erro ao processar a planilha. Verifique se o arquivo está em um formato válido (XLSX, XLS, CSV).");
      setPlanilhaData(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle selection of all rows
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setTableData(prevData => 
      prevData.map(row => ({ ...row, selected: checked }))
    );
  };

  // Handle selection of a single row
  const handleSelectRow = (id: number, checked: boolean) => {
    setTableData(prevData => {
      const newData = prevData.map(row => 
        row.id === id ? { ...row, selected: checked } : row
      );
      
      // Check if all rows are now selected
      const allSelected = newData.every(row => row.selected);
      setSelectAll(allSelected);
      
      return newData;
    });
  };

  // Handle deletion of a row
  const handleDeleteRow = (id: number) => {
    setTableData(prevData => {
      const newData = prevData.filter(row => row.id !== id);
      return newData;
    });
    
    toast.success("Linha removida com sucesso!");
  };

  const handleProcessar = () => {
    if (!planilhaData || !planilhaData.isValid) {
      toast.error("A planilha não é válida para processamento.");
      return;
    }

    setShowTable(true);
    toast.success(`Mostrando ${tableData.length} registros.`);
  };

  // New function to handle selected records
  const handleProcessSelected = () => {
    const selectedRows = tableData.filter(row => row.selected);
    
    if (selectedRows.length === 0) {
      toast.error("Nenhum registro selecionado para processamento.");
      return;
    }

    // Reset workflow steps and open dialog
    setWorkflow({
      paymentDate: undefined,
      serviceType: "Pagamentos Diversos",
      convenente: null,
      sendMethod: "cnab",
      outputDirectory: workflow.outputDirectory // Preserve directory setting
    });
    setCurrentStep(1);
    setShowWorkflowDialog(true);
  };

  // Workflow navigation functions
  const goToNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Function to open directory settings dialog
  const handleOpenDirectorySettings = () => {
    setShowDirectoryDialog(true);
  };

  // Function to save directory settings
  const handleSaveDirectorySettings = () => {
    localStorage.setItem('cnab240OutputDirectory', workflow.outputDirectory || '');
    setShowDirectoryDialog(false);
    toast.success("Configurações de diretório salvas com sucesso!");
  };

  // Final submission handler
  const handleSubmitWorkflow = async () => {
    const selectedRows = tableData.filter(row => row.selected);
    
    try {
      setShowWorkflowDialog(false);
      
      // If "API REST" method is selected, we would handle that differently
      if (workflow.sendMethod === 'api') {
        toast.success(`Enviando ${selectedRows.length} pagamentos via API REST...`);
        // This would call an API integration - not implemented yet
        return;
      }
      
      // For CNAB file generation
      const favorecidos: Favorecido[] = selectedRows.map(row => ({
        nome: row.NOME,
        inscricao: row.INSCRICAO,
        banco: row.BANCO,
        agencia: row.AGENCIA,
        conta: row.CONTA,
        tipo: row.TIPO,
        valor: parseFloat(row.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.'))
      }));
      
      // Generate and download the CNAB file
      await downloadCNABFile(workflow, favorecidos);
      
      console.log("Dados completos do processamento:", {
        registros: selectedRows,
        dataPagamento: workflow.paymentDate,
        tipoServico: workflow.serviceType,
        convenente: workflow.convenente,
        metodoEnvio: workflow.sendMethod,
        diretorioSaida: workflow.outputDirectory
      });
      
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      toast.error("Ocorreu um erro ao processar o arquivo CNAB");
    }
  };

  // Function to update workflow data
  const updateWorkflow = (field: keyof CNABWorkflowData, value: any) => {
    setWorkflow(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to check if the current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1: // Date selection
        return workflow.paymentDate !== undefined;
      case 2: // Service type
        return workflow.serviceType !== "";
      case 3: // Convenente
        return workflow.convenente !== null;
      case 4: // Send method
        return workflow.sendMethod !== "";
      default:
        return false;
    }
  };

  return {
    file,
    loading,
    planilhaData,
    errorMessage,
    tableData,
    selectAll,
    showTable,
    setShowTable,
    total,
    showWorkflowDialog,
    setShowWorkflowDialog,
    showDirectoryDialog,
    setShowDirectoryDialog,
    currentStep,
    workflow,
    convenentes,
    carregandoConvenentes,
    handleFileChange,
    validateFile,
    handleSelectAll,
    handleSelectRow,
    handleDeleteRow,
    handleProcessar,
    handleProcessSelected,
    goToNextStep,
    goToPreviousStep,
    handleOpenDirectorySettings,
    handleSaveDirectorySettings,
    handleSubmitWorkflow,
    updateWorkflow,
    isCurrentStepValid
  };
};
