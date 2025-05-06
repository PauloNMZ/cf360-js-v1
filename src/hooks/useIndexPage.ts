
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  getConvenentes, 
  getConvenenteById,
  searchConvenentesByTerm
} from "@/services/convenenteService";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";
import { getCompanySettings } from "@/services/companySettings";

export const useIndexPage = () => {
  const { toast } = useToast();
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Form and data states
  const [formMode, setFormMode] = useState<'view' | 'create' | 'edit'>('view');
  const [formData, setFormData] = useState<ConvenenteData>({...emptyConvenente});
  const [formValid, setFormValid] = useState(false);
  const [convenentes, setConvenentes] = useState<Array<ConvenenteData & { id: string }>>([]);
  const [currentConvenenteId, setCurrentConvenenteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConvenentes, setFilteredConvenentes] = useState<Array<ConvenenteData & { id: string }>>([]);
  const [companySettings, setCompanySettings] = useState({
    logoUrl: '',
    companyName: 'Gerador de Pagamentos'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Load convenentes when modal is opened only once
  useEffect(() => {
    const loadConvenentes = async () => {
      if (modalOpen && !dataLoaded) {
        setIsLoading(true);
        try {
          const loadedConvenentes = await getConvenentes();
          setConvenentes(loadedConvenentes);
          setFilteredConvenentes(loadedConvenentes);
          setDataLoaded(true);
        } catch (error) {
          console.error("Erro ao carregar convenentes:", error);
          toast({
            title: "Erro ao carregar dados",
            description: "Ocorreu um erro ao buscar os convenentes.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadConvenentes();
  }, [modalOpen, toast, dataLoaded]);

  // Reset data loaded when modal is closed
  useEffect(() => {
    if (!modalOpen) {
      setDataLoaded(false);
      // Reset the form data when modal closes
      setFormData({...emptyConvenente});
      setCurrentConvenenteId(null);
      setFormMode('view');
    }
  }, [modalOpen]);

  // Load company settings
  useEffect(() => {
    const settings = getCompanySettings();
    setCompanySettings(settings);
  }, []);
  
  // Reload company settings when admin panel is closed
  useEffect(() => {
    if (!adminPanelOpen) {
      const settings = getCompanySettings();
      setCompanySettings(settings);
    }
  }, [adminPanelOpen]);

  // Use database search function when search term changes
  useEffect(() => {
    const searchConvenentes = async () => {
      // Minimum search length check
      if (!searchTerm || searchTerm.trim().length < 1) {
        // If search is cleared, reset to all convenentes
        setFilteredConvenentes(convenentes);
        return;
      }

      setIsSearching(true);
      try {
        console.log("Searching for:", searchTerm);
        const searchResults = await searchConvenentesByTerm(searchTerm);
        console.log("Search results:", searchResults.length);
        setFilteredConvenentes(searchResults);
      } catch (error) {
        console.error("Erro na pesquisa:", error);
        toast({
          title: "Erro na pesquisa",
          description: "Ocorreu um erro ao pesquisar convenentes.",
          variant: "destructive",
        });
        // If search fails, fallback to all convenentes
        setFilteredConvenentes(convenentes);
      } finally {
        setIsSearching(false);
      }
    };

    // Use a small delay to prevent excessive API calls
    const timeoutId = setTimeout(() => {
      searchConvenentes();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, convenentes, toast]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectConvenente = useCallback(async (convenente: ConvenenteData & { id: string }) => {
    // First set the mode back to view
    setFormMode('view');
    setCurrentConvenenteId(convenente.id);
    
    try {
      setIsLoading(true);
      // Get complete convenente from database only if not in edit mode
      // For edit mode, use the data we already have
      setFormData(convenente);
      
      // Only fetch if additional data is needed and not in edit mode
      if (formMode !== 'edit') {
        const completeConvenente = await getConvenenteById(convenente.id);
        if (completeConvenente) {
          setFormData(completeConvenente);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar detalhes do convenente:", error);
      toast({
        title: "Erro ao carregar detalhes",
        description: "Não foi possível carregar os detalhes do convenente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, formMode]);

  const handleFormDataChange = useCallback((data: ConvenenteData) => {
    console.log("Form data changing:", data.cnpj); // Debugging
    setFormData(data);
    
    // Check if required fields are filled
    const requiredFields = ['cnpj', 'razaoSocial'];
    const hasRequiredFields = requiredFields.every(field => data[field] && data[field].toString().trim() !== '');
    setFormValid(hasRequiredFields);
  }, []);

  return {
    modalOpen,
    setModalOpen,
    importModalOpen,
    setImportModalOpen,
    adminPanelOpen,
    setAdminPanelOpen,
    showDeleteDialog,
    setShowDeleteDialog,
    formMode,
    setFormMode,
    formData,
    setFormData,
    formValid,
    setFormValid,
    convenentes,
    setConvenentes,
    currentConvenenteId,
    setCurrentConvenenteId,
    searchTerm,
    filteredConvenentes,
    companySettings,
    isLoading,
    setIsLoading,
    isSearching,
    handleSearchChange,
    handleSelectConvenente,
    handleFormDataChange
  };
};
