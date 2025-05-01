import { useState, useEffect } from "react";
import FormularioModerno from "@/components/FormularioModerno";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NavButton } from "@/components/ui/NavButton";
import AdminPanel from "@/components/AdminPanel";
import ImportarPlanilha from "@/components/ImportarPlanilha";
import { 
  Home, 
  FileUp, 
  FileSearch, 
  Package, 
  Send, 
  RefreshCw, 
  FileText, 
  Search, 
  LogOut,
  Shield,
  Plus,
  Edit,
  TrashIcon,
  Save,
  LayoutDashboard,
  AlertCircle
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent, 
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { saveConvenente, getConvenentes, updateConvenente, deleteConvenente } from "@/services/storage";
import { formatCNPJ } from "@/utils/formValidation";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";

const Index = () => {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [formMode, setFormMode] = useState<'view' | 'create' | 'edit'>('view');
  const [formData, setFormData] = useState<ConvenenteData>({...emptyConvenente});
  const [formValid, setFormValid] = useState(false);
  const [convenentes, setConvenentes] = useState<Array<ConvenenteData & { id: string }>>([]);
  const [currentConvenenteId, setCurrentConvenenteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConvenentes, setFilteredConvenentes] = useState<Array<ConvenenteData & { id: string }>>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Load convenentes from localStorage on start
  useEffect(() => {
    const loadedConvenentes = getConvenentes();
    setConvenentes(loadedConvenentes);
    setFilteredConvenentes(loadedConvenentes);
  }, []);

  // Filter convenentes when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredConvenentes(convenentes);
    } else {
      const searchLower = searchTerm.toLowerCase().trim();
      const searchCNPJ = searchTerm.replace(/\D/g, '');
      
      console.log("Searching for:", searchLower);
      
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
        
        console.log(`Checking company: ${razaoSocial}, Name match: ${nameMatch}, CNPJ match: ${cnpjMatch}, Search term: "${searchLower}"`);
        
        return nameMatch || cnpjMatch;
      });
      
      console.log("Search term:", searchTerm);
      console.log("Search term (lowercase):", searchLower);
      console.log("Filtered convenentes:", filtered);
      setFilteredConvenentes(filtered);
    }
  }, [searchTerm, convenentes]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    console.log("Search value:", value);
    setSearchTerm(value);
  };

  const handleConvenenteClick = () => {
    console.log("Convenente button clicked");
    setModalOpen(true);
  };

  const handleImportarPlanilhaClick = () => {
    console.log("Importar Planilha button clicked");
    setImportModalOpen(true);
  };

  const handleLogoutClick = () => {
    console.log("Logout button clicked");
    // In a real application, this would handle the logout process
    toast({
      title: "Até logo!",
      description: "Você foi desconectado do sistema com sucesso.",
    });
  };

  const handleAdminPanelClick = () => {
    console.log("Admin Panel button clicked");
    setAdminPanelOpen(true);
  };

  const handleCreateNew = () => {
    setFormMode('create');
    setFormValid(false); // Reset form validity when creating new
    setCurrentConvenenteId(null);
    setFormData({...emptyConvenente});
    console.log("Create new convenente");
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
    console.log("Edit convenente", currentConvenenteId);
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

  const confirmDelete = () => {
    if (currentConvenenteId) {
      const result = deleteConvenente(currentConvenenteId);
      
      if (result) {
        toast({
          title: "Convenente excluído",
          description: "O convenente foi excluído com sucesso.",
        });
        
        // Update list and close dialog
        setConvenentes(getConvenentes());
        setCurrentConvenenteId(null);
        setFormData({...emptyConvenente});
        setFormMode('view');
      } else {
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o convenente.",
          variant: "destructive",
        });
      }
    }
    
    setShowDeleteDialog(false);
  };

  const handleSave = () => {
    try {
      if (formMode === 'create') {
        // Save new convenente
        const newConvenente = saveConvenente(formData);
        
        toast({
          title: "Convenente salvo",
          description: `${formData.razaoSocial} foi cadastrado com sucesso.`,
        });
        
        // Update list and select new convenente
        setConvenentes(getConvenentes());
        setCurrentConvenenteId(newConvenente.id);
      } else if (formMode === 'edit' && currentConvenenteId) {
        // Update existing convenente
        const updatedConvenente = updateConvenente(currentConvenenteId, formData);
        
        if (updatedConvenente) {
          toast({
            title: "Convenente atualizado",
            description: `${formData.razaoSocial} foi atualizado com sucesso.`,
          });
          
          // Update list
          setConvenentes(getConvenentes());
        } else {
          toast({
            title: "Erro ao atualizar",
            description: "Não foi possível atualizar o convenente.",
            variant: "destructive",
          });
        }
      }
      
      // Return to view mode
      setFormMode('view');
    } catch (error) {
      console.error('Erro ao salvar convenente:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o convenente.",
        variant: "destructive",
      });
    }
  };

  const handleFormDataChange = (data: ConvenenteData) => {
    setFormData(data);
    // Check if required fields are filled
    const requiredFields = ['cnpj', 'razaoSocial'];
    const hasRequiredFields = requiredFields.every(field => data[field] && data[field].toString().trim() !== '');
    setFormValid(hasRequiredFields);
  };

  const handleSelectConvenente = (convenente) => {
    setCurrentConvenenteId(convenente.id);
    setFormData(convenente);
    setFormMode('view');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-slate-900 dark:text-white">
      {/* Header com gradiente azul */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950 text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">GERADOR DE PAGAMENTOS</h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content area - with flex-grow to push footer down */}
      <div className="flex-grow overflow-y-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Ícones de navegação em uma única linha */}
          <div className="flex overflow-x-auto pb-4 mb-12 gap-2">
            <NavButton 
              icon={<Home size={24} />} 
              label="Convenente" 
              onClick={handleConvenenteClick} 
            />
            <NavButton 
              icon={<FileUp size={24} />} 
              label="Importar Planilha" 
              onClick={handleImportarPlanilhaClick} 
            />
            <NavButton 
              icon={<FileSearch size={24} />} 
              label="Verificar Erros" 
              onClick={() => {}} 
            />
            <NavButton 
              icon={<Package size={24} />} 
              label="Gerar Remessa" 
              onClick={() => {}} 
            />
            <NavButton 
              icon={<Send size={24} />} 
              label="Enviar ao Banco" 
              onClick={() => {}} 
            />
            <NavButton 
              icon={<RefreshCw size={24} />} 
              label="Processar Retornos" 
              onClick={() => {}} 
            />
            <NavButton 
              icon={<FileText size={24} />} 
              label="Comprovantes" 
              onClick={() => {}} 
            />
            <NavButton 
              icon={<Search size={24} />} 
              label="Consultas" 
              onClick={() => {}} 
            />
            <NavButton 
              icon={<LayoutDashboard size={24} />} 
              label="Dashboard" 
              onClick={() => {}} 
            />
            <NavButton 
              icon={<Shield size={24} />} 
              label="Setup" 
              onClick={handleAdminPanelClick} 
            />
            <NavButton 
              icon={<LogOut size={24} />} 
              label="Sair" 
              onClick={handleLogoutClick} 
              className="bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900 border-red-200 dark:border-red-800"
            />
          </div>
        </div>
      </div>
      
      {/* Modal de Cadastro de Convenente */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-6">Cadastro de Convenente</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Lista de convenentes */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    placeholder="Buscar convenentes..." 
                    className="pl-10 border-blue-200 focus:border-blue-500"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              
              <div className="h-[500px] overflow-y-auto">
                {filteredConvenentes.length > 0 ? (
                  <ul className="space-y-2">
                    {filteredConvenentes.map((convenente) => (
                      <li 
                        key={convenente.id}
                        onClick={() => handleSelectConvenente(convenente)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          currentConvenenteId === convenente.id 
                            ? 'bg-blue-100 border border-blue-300' 
                            : 'hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <h3 className="font-medium text-blue-800">{convenente.razaoSocial}</h3>
                        <p className="text-sm text-gray-500">
                          CNPJ: {formatCNPJ(convenente.cnpj)}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <AlertCircle size={40} className="mb-2 text-blue-400" />
                    {searchTerm ? (
                      <p>Nenhum resultado para "{searchTerm}"</p>
                    ) : (
                      <p>Nenhum convenente cadastrado</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Formulário */}
            <div className="lg:col-span-2">
              <div className="flex justify-between mb-4">
                <div className="flex space-x-2">
                  <Button
                    onClick={handleCreateNew}
                    variant="outline"
                    className="flex items-center gap-1"
                    disabled={formMode === 'create'}
                  >
                    <Plus size={16} /> Novo
                  </Button>
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="flex items-center gap-1"
                    disabled={formMode === 'edit' || !currentConvenenteId}
                  >
                    <Edit size={16} /> Editar
                  </Button>
                  <Button
                    onClick={handleDelete}
                    variant="outline"
                    className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                    disabled={!currentConvenenteId}
                  >
                    <TrashIcon size={16} /> Excluir
                  </Button>
                </div>
                {(formMode === 'create' || formMode === 'edit') && (
                  <Button
                    onClick={handleSave}
                    variant="default"
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                    disabled={!formValid}
                  >
                    <Save size={16} /> Salvar
                  </Button>
                )}
              </div>
              
              <ScrollArea className="h-[500px] pr-4">
                <div className="py-4">
                  <FormularioModerno 
                    onFormDataChange={handleFormDataChange} 
                    formMode={formMode}
                    initialData={formData} 
                  />
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Importação de Planilha */}
      <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-6">Importação de Planilha</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <ImportarPlanilha />
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal do Painel de Administração */}
      <Dialog open={adminPanelOpen} onOpenChange={setAdminPanelOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-6">Painel de Setup</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <AdminPanel />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de confirmação para exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este convenente?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Status bar - Now it's outside the scrollable area */}
      <footer className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950 text-white py-3 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long' })}
            </h2>
            <p className="text-sm">
              {new Date().toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm">GeraPag 1.01</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
