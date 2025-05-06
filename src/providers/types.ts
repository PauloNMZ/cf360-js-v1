
import { ConvenenteData } from "@/types/convenente";

// Define types for the IndexPage state
export interface IndexPageState {
  // Modal states
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  importModalOpen: boolean;
  setImportModalOpen: (open: boolean) => void;
  adminPanelOpen: boolean;
  setAdminPanelOpen: (open: boolean) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  formMode: 'view' | 'create' | 'edit';
  setFormMode: (mode: 'view' | 'create' | 'edit') => void;
  
  // Form and data states
  formData: ConvenenteData;
  setFormData: (data: ConvenenteData) => void;
  formValid: boolean;
  setFormValid: (valid: boolean) => void;
  convenentes: Array<ConvenenteData & { id: string }>;
  setConvenentes: (convenentes: Array<ConvenenteData & { id: string }>) => void;
  currentConvenenteId: string | null;
  setCurrentConvenenteId: (id: string | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  
  // Search states
  searchTerm: string;
  filteredConvenentes: Array<ConvenenteData & { id: string }>;
  isSearching: boolean;
  
  // Functions
  handleSelectConvenente: (convenente: ConvenenteData & { id: string }, formMode: 'view' | 'create' | 'edit') => void;
  handleFormDataChange: (data: ConvenenteData) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  // Additional properties
  companySettings: any;
}

// Define types for the IndexPageActions
export interface IndexPageActions {
  handleSave: (data: ConvenenteData) => void;
  handleCreateNew: () => void;
  handleDelete: () => void;
  confirmDelete: () => void;
}

// Define props for IndexPageEventHandlers
export interface IndexPageActionProps {
  indexPage: IndexPageState;
  indexPageActions: IndexPageActions;
  setCnabToApiModalOpen: (open: boolean) => void;
}
