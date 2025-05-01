
import { useState, useEffect } from "react";
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

  // Load convenentes when modal is opened
  useEffect(() => {
    const loadConvenentes = async () => {
      setIsLoading(true);
      try {
        const loadedConvenentes = await getConvenentes();
        setConvenentes(loadedConvenentes);
        setFilteredConvenentes(loadedConvenentes);
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
    };

    // Load company settings
    const settings = getCompanySettings();
    setCompanySettings(settings);
    
    if (modalOpen) {
      loadConvenentes();
    }
  }, [modalOpen, toast]);

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
    } else {
      const searchLower = searchTerm.toLowerCase().trim();
      const searchCNPJ = searchTerm.replace(/\D/g, '');
      
      const filtered = convenentes.filter(conv => {
        if (!conv) return false;
        
        // Safe access to properties
        const razaoSocial = conv.razaoSocial || '';
        const cnpj = conv.cnpj || '';
        
        // Search by company name - convert to lowercase for comparison
        const nameMatch = razaoSocial.toLowerCase().includes(searchLower);
        
        // Search by CNPJ - remove formatting before comparing
        const cnpjClean = cnpj.replace(/\D/g, '');
        const cnpjMatch = cnpjClean.includes(searchCNPJ);
        
        return nameMatch || cnpjMatch;
      });
      
      setFilteredConvenentes(filtered);
    }
  }, [searchTerm, convenentes]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectConvenente = async (convenente: ConvenenteData & { id: string }) => {
    setCurrentConvenenteId(convenente.id);
    
    try {
      setIsLoading(true);
      // Get complete convenente from database
      const completeConvenente = await getConvenenteById(convenente.id);
      if (completeConvenente) {
        setFormData(completeConvenente);
        setFormMode('view');
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
  };

  const handleFormDataChange = (data: ConvenenteData) => {
    setFormData(data);
    // Check if required fields are filled
    const requiredFields = ['cnpj', 'razaoSocial'];
    const hasRequiredFields = requiredFields.every(field => data[field] && data[field].toString().trim() !== '');
    setFormValid(hasRequiredFields);
  };

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
