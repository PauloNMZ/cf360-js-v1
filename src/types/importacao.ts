
import { CNABWorkflowData, Favorecido } from "@/types/cnab240";
import { ReportSortType } from "@/types/reportSorting";

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
  handleSubmit: (selectedRows: RowData[]) => Promise<{ success: boolean; fileName?: string }>; // UPDATED: Nova assinatura
  isCurrentStepValid: boolean;
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
  handleEditRow: (id: number) => void; // ADDED: Handler para editar linha
  handleProcessSelected: () => void;
  handleClearSelection: () => void;
  selectedCount: number;
  handleVerifyErrors: () => void;
  handleExportErrors: () => void;
  handleGenerateReport: (sortType?: ReportSortType) => void;
  total: number;
  setShowTable: (show: boolean) => void;
  validationPerformed: boolean;
  hasValidationErrors: boolean;
  cnabFileGenerated?: boolean;
}

export interface FileUploadViewProps {
  file: File | null;
  handleFileChange: (files: File[]) => void;
  errorMessage: string | null;
  planilhaData: PlanilhaData | null;
  loading: boolean;
  handleProcessar: () => void;
}

export interface PDFPreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reportData: ReportData | null;
  onSendEmail: () => void;
  sortType?: ReportSortType; // ADDED: Optional sort type parameter
}

export interface EmailFormValues {
  recipientEmail: string;
  senderName: string;
  senderEmail: string;
  senderDepartment: string;
  remittanceReference: string;
  companyName?: string;
  message: string;
}

export interface ValidationErrorsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  errors: any[];
  handleExportErrors?: () => void;
}

// PDF report types - UPDATED: Added dataPagamento field
export interface ReportData {
  empresaNome: string;
  empresaCnpj: string;
  dataGeracao: string;
  dataPagamento: string;
  referencia: string;
  beneficiarios: RowData[];
  totalRegistros: number;
  valorTotal: number;
}
