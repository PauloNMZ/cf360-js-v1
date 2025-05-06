
import { createContext } from "react";
import { ConvenenteData } from "@/types/convenente";
import { CompanySettings } from "@/types/companySettings";

// Define the type for our context
export interface IndexPageContextType {
  // Modal states
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  importModalOpen: boolean;
  setImportModalOpen: (open: boolean) => void;
  adminPanelOpen: boolean;
  setAdminPanelOpen: (open: boolean) => void;
  cnabToApiModalOpen: boolean;
  setCnabToApiModalOpen: (open: boolean) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  
  // Form states and data
  formMode: 'view' | 'create' | 'edit';
  setFormMode: (mode: 'view' | 'create' | 'edit') => void;
  formData: ConvenenteData;
  setFormData: (data: ConvenenteData) => void;
  formValid: boolean;
  setFormValid: (valid: boolean) => void;
  convenentes: Array<ConvenenteData & { id: string }>;
  setConvenentes: (convenentes: Array<ConvenenteData & { id: string }>) => void;
  currentConvenenteId: string | null;
  setCurrentConvenenteId: (id: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Search states
  searchTerm: string;
  filteredConvenentes: Array<ConvenenteData & { id: string }>;
  isSearching: boolean;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  // Company settings
  companySettings: CompanySettings | null;
  
  // Event handlers
  handleConvenenteClick: () => void;
  handleImportarPlanilhaClick: () => void;
  handleCnabToApiClick: () => void;
  handleAdminPanelClick: () => void;
  handleLogoutClick: () => void;
  handleConvenenteModalOpenChange: (open: boolean) => void;
  handleSaveClick: () => void;
  handleEdit: () => void;
  handleSelectConvenente: (convenente: ConvenenteData & { id: string }, formMode: 'view' | 'create' | 'edit') => void;
  handleFormDataChange: (data: ConvenenteData) => void;
  handleCreateNew: () => void;
  handleDelete: () => void;
  confirmDelete: () => void;
}

// Create the context with a default empty value
export const IndexPageContext = createContext<IndexPageContextType | undefined>(undefined);
