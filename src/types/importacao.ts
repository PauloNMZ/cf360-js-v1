
import { CNABWorkflowData, Favorecido } from "@/types/cnab240";

// Define the expected column headers
export const EXPECTED_HEADERS = [
  'NOME', 'INSCRICAO', 'BANCO', 'AGENCIA', 'CONTA', 'TIPO', 'VALOR'
];

export interface PlanilhaData {
  headers: string[];
  rows: any[];
  isValid: boolean;
  missingColumns: string[];
  extraColumns: string[];
}

export interface RowData {
  [key: string]: any;
  selected?: boolean;
  id: number;
}

export interface ImportacaoStep {
  currentStep: number;
  totalSteps: number;
}

export interface WorkflowDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workflow: CNABWorkflowData;
  updateWorkflow: (field: keyof CNABWorkflowData, value: any) => void;
  currentStep: number;
  totalSteps: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  handleSubmit: () => void;
  isCurrentStepValid: () => boolean;
  convenentes: Array<any>;
  carregandoConvenentes: boolean;
}

export interface DirectoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workflow: CNABWorkflowData;
  updateWorkflow: (field: keyof CNABWorkflowData, value: any) => void;
  handleSaveSettings: () => void;
}

export interface TableViewProps {
  handleSelectAll: (checked: boolean) => void;
  selectAll: boolean;
  tableData: RowData[];
  handleSelectRow: (id: number, checked: boolean) => void;
  handleDeleteRow: (id: number) => void;
  handleProcessSelected: () => void;
  handleVerifyErrors: () => void;
  total: number;
  setShowTable: (show: boolean) => void;
}

export interface FileUploadViewProps {
  file: File | null;
  handleFileChange: (files: File[]) => void;
  errorMessage: string | null;
  planilhaData: PlanilhaData | null;
  loading: boolean;
  handleProcessar: () => void;
}
