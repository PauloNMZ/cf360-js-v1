
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  saveConvenente, 
  getConvenentes, 
  updateConvenente, 
  deleteConvenente, 
  getConvenenteById 
} from "@/services/convenenteService";
import { getCompanySettings } from "@/services/companySettings";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";

// Import our new components
import MainLayout from "@/components/layout/MainLayout";
import NavigationMenu from "@/components/navigation/NavigationMenu";
import ConvenenteModal from "@/components/convenente/ConvenenteModal";
import DeleteConvenenteDialog from "@/components/convenente/DeleteConvenenteDialog";
import ImportacaoModal from "@/components/importacao/ImportacaoModal";
import AdminPanelModal from "@/components/admin/AdminPanelModal";

const Index = () => {
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  
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

  // Carregar convenentes do Supabase ao iniciar
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

    // Carregar configurações da empresa
    const settings = getCompanySettings();
    setCompanySettings(settings);
    
    if (modalOpen) {
      loadConvenentes();
    }
  }, [modalOpen, toast]);

  // Carregar configurações da empresa quando o painel de administração é fechado
  useEffect(() => {
    if (!adminPanelOpen) {
      const settings = getCompanySettings();
      setCompanySettings(settings);
    }
  }, [adminPanelOpen]);

  // Filtrar convenentes quando o termo de pesquisa muda
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleConvenenteClick = () => {
    setModalOpen(true);
  };

  const handleImportarPlanilhaClick = () => {
    setImportModalOpen(true);
  };

  const handleLogoutClick = async () => {
    await signOut();
  };

  const handleAdminPanelClick = () => {
    setAdminPanelOpen(true);
  };

  const handleCreateNew = () => {
    setFormMode('create');
    setFormValid(false); // Reset form validity when creating new
    setCurrentConvenenteId(null);
    setFormData({...emptyConvenente});
  };

  const handleEdit = () => {
    if (!currentConvenenteId) {
      toast({
        title: "Nenhum convenente selecionado",
        description: "Selecione um convenente da lista para editar.",
        variant: "destructive",
      });
      return;
    }
    
    setFormMode('edit');
    setFormValid(true); // Assume the existing data is valid when editing
  };

  const handleDelete = () => {
    if (!currentConvenenteId) {
      toast({
        title: "Nenhum convenente selecionado",
        description: "Selecione um convenente da lista para excluir.",
        variant: "destructive",
      });
      return;
    }
    
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (currentConvenenteId) {
      setIsLoading(true);
      try {
        await deleteConvenente(currentConvenenteId);
        
        toast({
          title: "Convenente excluído",
          description: "O convenente foi excluído com sucesso.",
        });
        
        // Update list and close dialog
        const updatedConvenentes = await getConvenentes();
        setConvenentes(updatedConvenentes);
        setCurrentConvenenteId(null);
        setFormData({...emptyConvenente});
        setFormMode('view');
      } catch (error) {
        console.error("Erro ao excluir:", error);
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o convenente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    setShowDeleteDialog(false);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      if (formMode === 'create') {
        // Salvar novo convenente
        const newConvenente = await saveConvenente(formData);
        
        toast({
          title: "Convenente salvo",
          description: `${formData.razaoSocial} foi cadastrado com sucesso.`,
        });
        
        // Atualizar lista e selecionar novo convenente
        const updatedConvenentes = await getConvenentes();
        setConvenentes(updatedConvenentes);
        setCurrentConvenenteId(newConvenente.id);
      } else if (formMode === 'edit' && currentConvenenteId) {
        // Atualizar convenente existente
        const updatedConvenente = await updateConvenente(currentConvenenteId, formData);
        
        if (updatedConvenente) {
          toast({
            title: "Convenente atualizado",
            description: `${formData.razaoSocial} foi atualizado com sucesso.`,
          });
          
          // Atualizar lista
          const updatedConvenentes = await getConvenentes();
          setConvenentes(updatedConvenentes);
        } else {
          toast({
            title: "Erro ao atualizar",
            description: "Não foi possível atualizar o convenente.",
            variant: "destructive",
          });
        }
      }
      
      // Retornar ao modo de visualização
      setFormMode('view');
    } catch (error) {
      console.error('Erro ao salvar convenente:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o convenente.",
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

  const handleSelectConvenente = async (convenente) => {
    setCurrentConvenenteId(convenente.id);
    
    try {
      setIsLoading(true);
      // Obter convenente completo do banco de dados
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

  return (
    <MainLayout companySettings={companySettings}>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <NavigationMenu 
          onConvenenteClick={handleConvenenteClick}
          onImportarPlanilhaClick={handleImportarPlanilhaClick}
          onAdminPanelClick={handleAdminPanelClick}
          onLogoutClick={handleLogoutClick}
        />
      </div>

      {/* Modals */}
      <ConvenenteModal 
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        convenentes={convenentes}
        filteredConvenentes={filteredConvenentes}
        currentConvenenteId={currentConvenenteId}
        formData={formData}
        formMode={formMode}
        formValid={formValid}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSelectConvenente={handleSelectConvenente}
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSave={handleSave}
        onFormDataChange={handleFormDataChange}
      />

      <ImportacaoModal 
        isOpen={importModalOpen}
        onOpenChange={setImportModalOpen}
      />

      <AdminPanelModal 
        isOpen={adminPanelOpen}
        onOpenChange={setAdminPanelOpen}
      />

      <DeleteConvenenteDialog 
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDelete={confirmDelete}
      />
    </MainLayout>
  );
};

export default Index;
