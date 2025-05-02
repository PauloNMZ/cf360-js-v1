import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  getConvenentes, 
  getConvenenteById 
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

  // Filter convenentes when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredConvenentes(convenentes);
      return;
    }
    
    const searchLower = searchTerm.toLowerCase().trim();
    const searchCNPJ = searchTerm.replace(/\D/g, '');
    
    console.log("Termo de busca:", searchLower);
    console.log("Convenentes disponíveis:", convenentes.length);
    
    // For debugging, let's print all available company names before filtering
    console.log("All available companies:", convenentes.map(c => ({
      name: String(c.razaoSocial || ''), 
      nameLower: String(c.razaoSocial || '').toLowerCase()
    })));
    
    const filtered = convenentes.filter(conv => {
      if (!conv) return false;
      
      // Convert razaoSocial and cnpj to strings and ensure they're not undefined
      // Important: keep the original value and only convert to lowercase during comparison
      const razaoSocial = String(conv.razaoSocial || '');
      const razaoSocialLower = razaoSocial.toLowerCase();
      const cnpj = String(conv.cnpj || '');
      const cnpjClean = cnpj.replace(/\D/g, '');
      
      // Check if company name contains search term (case insensitive)
      const nameMatch = razaoSocialLower.includes(searchLower);
      
      // Check if CNPJ contains search digits
      const cnpjMatch = cnpjClean.includes(searchCNPJ);
      
      console.log(`Checking: "${razaoSocial}" (${razaoSocialLower}) - Name matches: ${nameMatch}, CNPJ matches: ${cnpjMatch}`);
      
      return nameMatch || cnpjMatch;
    });
    
    console.log("Filtered results:", filtered.length);
    console.log("Companies found:", filtered.map(c => c.razaoSocial));
    
    setFilteredConvenentes(filtered);
  }, [searchTerm, convenentes]);

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
    handleSearchChange,
    handleSelectConvenente,
    handleFormDataChange
  };
};
