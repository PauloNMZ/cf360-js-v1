
import { useState, useEffect } from "react";
import FormularioModerno from "@/components/FormularioModerno";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NavButton } from "@/components/ui/NavButton";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { saveConvenente, getConvenentes, updateConvenente, deleteConvenente } from "@/services/storage";
import { formatCNPJ } from "@/utils/formValidation";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";

const Index = () => {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
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
      const searchLower = searchTerm.toLowerCase();
      const filtered = convenentes.filter(
        conv => 
          conv.razaoSocial.toLowerCase().includes(searchLower) || 
          // Remove formatting from CNPJ before comparing
          conv.cnpj.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, ''))
      );
      console.log("Search term:", searchTerm);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-slate-900 dark:text-white flex flex-col">
      {/* Header com gradiente azul */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950 text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">GERADOR DE PAGAMENTOS</h1>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex-grow">
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
            onClick={() => {}} 
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
      
      {/* Status bar - Fixed at the bottom */}
      <footer className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950 text-white py-3 px-6 mt-auto">
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

// Componente para o Painel de Administração
const AdminPanel = () => {
  const [showBankConnections, setShowBankConnections] = useState(false);
  const [bankConnections, setBankConnections] = useState([
    { 
      id: 1, 
      appKey: '51f3e692d4f797199a0caa25c4784f3a', 
      clientId: 'eyJpZCI6IjY8&3NjZmOTctNmM5My0iLCJjb2RpZ29QdWJsaWNhZG9yIjowLCJjb2RpZ29Tb2Z0d2FyZSI6MTAzNTgxLCJzZXF1ZW5jaWFsSW5zdGFsYWNhbyI6Mn0', 
      clientSecret: 'eyJpZCI6ImI1ODgyZWYtYWJlNi00NTMwLWExNGQtMTdjZDZjZDU0NWEyMTBmMGYxZDEtIiwiY29kaWdvUHVibGljYWRvciI6MCwiY29kaWdvU29mdHdhcmUiOjEwMzU4MSwic2VxdWVuY2lhbEluc3RhbGFjYW8iOjIsInNlcXVlbmNpYWxDcmVkZW5jaWFsIjoyLCJhbWJpZW50ZSI6InByb2R1Y2FvIiwiaWF0IjoxNzQ2MDMzNzI2MDcwfQ',
      registrarToken: 'eyJpZCI6IjViOTIzMTM0LWZjZDktNDNhZS1hOWUxLWI2NDVlODJkMzM4NiIsImNvZGlnb1NvZnR3YXJlIjoxMDM1ODEsInNlcXVlbmNpYWxJbnN0YWxhY2FvIjowLCJzZXF1ZW5jaWFsVG9rZW4iOjEsImNvZGlnb1RpcG9Ub2tlbiI6MiwiYW1iaWVudGUiOiJwcm9kdWNhbyIsImlhdCI6MTc0NjAzMzcyNjAzMn0',
      basic: 'ZXlKcFpDSTZJalkzTmpabU9UY3RObU01TXkwaUxDSmpiMlJwWjI5UWRXSnNhV05oWkc5eUlqb3dMQ0pqYjJScFoyOVRiMlowZDJGeVpTSTZNVEF6TlRneExDSnpaWEYxWlc1amFXRnNTVzV6ZEdGc1lXTmhieUk2TW4wOmV5SnBaQ0k2SW1JMU9EZ3laV1l0WVdKbE5pMDByVE13TFdFeE5HUXRNVGRqWkRaalpEVTBOV0V5TVRCbU1HWXhaREV0SWl3aVkyOWthV2R2VUhWaWJHbGpZV1J2Y2lJNk1Dd2lZMjlreFdkdlUyOW1kSGRoY21VaU9qRXdNelU0TVN3aWMyVnhkV1Z1WTJsaGJFbHVjM1JoYkdGallXOGlPaklzSW5ObGNYVmxibU5wWVd4RGNtVmtaVzVqYVdGc0lqb3lMQ0poYldKcFpXNTBaU0k2SW5CeWIyUjFZMkZ2SWl3aWFXRjBJam94TnpRMk1ETXpOekkyTURjd25=',
      userBBsia: 'user123',
      passwordBBsia: '********'
    }
  ]);
  const [editConnection, setEditConnection] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [connectionToDelete, setConnectionToDelete] = useState(null);

  // Form fields for creating/editing
  const [formValues, setFormValues] = useState({
    appKey: '51f3e692d4f797199a0caa25c4784f3a',
    clientId: 'eyJpZCI6IjY8&3NjZmOTctNmM5My0iLCJjb2RpZ29QdWJsaWNhZG9yIjowLCJjb2RpZ29Tb2Z0d2FyZSI6MTAzNTgxLCJzZXF1ZW5jaWFsSW5zdGFsYWNhbyI6Mn0',
    clientSecret: 'eyJpZCI6ImI1ODgyZWYtYWJlNi00NTMwLWExNGQtMTdjZDZjZDU0NWEyMTBmMGYxZDEtIiwiY29kaWdvUHVibGljYWRvciI6MCwiY29kaWdvU29mdHdhcmUiOjEwMzU4MSwic2VxdWVuY2lhbEluc3RhbGFjYW8iOjIsInNlcXVlbmNpYWxDcmVkZW5jaWFsIjoyLCJhbWJpZW50ZSI6InByb2R1Y2FvIiwiaWF0IjoxNzQ2MDMzNzI2MDcwfQ',
    registrarToken: 'eyJpZCI6IjViOTIzMTM0LWZjZDktNDNhZS1hOWUxLWI2NDVlODJkMzM4NiIsImNvZGlnb1NvZnR3YXJlIjoxMDM1ODEsInNlcXVlbmNpYWxJbnN0YWxhY2FvIjowLCJzZXF1ZW5jaWFsVG9rZW4iOjEsImNvZGlnb1RpcG9Ub2tlbiI6MiwiYW1iaWVudGUiOiJwcm9kdWNhbyIsImlhdCI6MTc0NjAzMzcyNjAzMn0',
    basic: 'ZXlKcFpDSTZJalkzTmpabU9UY3RObU01TXkwaUxDSmpiMlJwWjI5UWRXSnNhV05oWkc5eUlqb3dMQ0pqYjJScFoyOVRiMlowZDJGeVpTSTZNVEF6TlRneExDSnpaWEYxWlc1amFXRnNTVzV6ZEdGc1lXTmhieUk2TW4wOmV5SnBaQ0k2SW1JMU9EZ3laV1l0WVdKbE5pMDByVE13TFdFeE5HUXRNVGRqWkRaalpEVTBOV0V5TVRCbU1HWXhaREV0SWl3aVkyOWthV2R2VUhWaWJHbGpZV1J2Y2lJNk1Dd2lZMjlreFdkdlUyOW1kSGRoY21VaU9qRXdNelU0TVN3aWMyVnhkV1Z1WTJsaGJFbHVjM1JoYkdGallXOGlPaklzSW5ObGNYVmxibU5wWVd4RGNtVmtaVzVqYVdGc0lqb3lMQ0poYldKcFpXNTBaU0k2SW5CeWIyUjFZMkZ2SWl3aWFXRjBJam94TnpRMk1ETXpOekkyTURjd25=',
    userBBsia: '',
    passwordBBsia: ''
  });

  const handleBankConnectionsClick = () => {
    setShowBankConnections(true);
  };

  const handleBackToMenu = () => {
    setShowBankConnections(false);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateNew = () => {
    setFormValues({
      appKey: '51f3e692d4f797199a0caa25c4784f3a',
      clientId: 'eyJpZCI6IjY8&3NjZmOTctNmM5My0iLCJjb2RpZ29QdWJsaWNhZG9yIjowLCJjb2RpZ29Tb2Z0d2FyZSI6MTAzNTgxLCJzZXF1ZW5jaWFsSW5zdGFsYWNhbyI6Mn0',
      clientSecret: 'eyJpZCI6ImI1ODgyZWYtYWJlNi00NTMwLWExNGQtMTdjZDZjZDU0NWEyMTBmMGYxZDEtIiwiY29kaWdvUHVibGljYWRvciI6MCwiY29kaWdvU29mdHdhcmUiOjEwMzU4MSwic2VxdWVuY2lhbEluc3RhbGFjYW8iOjIsInNlcXVlbmNpYWxDcmVkZW5jaWFsIjoyLCJhbWJpZW50ZSI6InByb2R1Y2FvIiwiaWF0IjoxNzQ2MDMzNzI2MDcwfQ',
      registrarToken: 'eyJpZCI6IjViOTIzMTM0LWZjZDktNDNhZS1hOWUxLWI2NDVlODJkMzM4NiIsImNvZGlnb1NvZnR3YXJlIjoxMDM1ODEsInNlcXVlbmNpYWxJbnN0YWxhY2FvIjowLCJzZXF1ZW5jaWFsVG9rZW4iOjEsImNvZGlnb1RpcG9Ub2tlbiI6MiwiYW1iaWVudGUiOiJwcm9kdWNhbyIsImlhdCI6MTc0NjAzMzcyNjAzMn0',
      basic: 'ZXlKcFpDSTZJalkzTmpabU9UY3RObU01TXkwaUxDSmpiMlJwWjI5UWRXSnNhV05oWkc5eUlqb3dMQ0pqYjJScFoyOVRiMlowZDJGeVpTSTZNVEF6TlRneExDSnpaWEYxWlc1amFXRnNTVzV6ZEdGc1lXTmhieUk2TW4wOmV5SnBaQ0k2SW1JMU9EZ3laV1l0WVdKbE5pMDByVE13TFdFeE5HUXRNVGRqWkRaalpEVTBOV0V5TVRCbU1HWXhaREV0SWl3aVkyOWthV2R2VUhWaWJHbGpZV1J2Y2lJNk1Dd2lZMjlreFdkdlUyOW1kSGRoY21VaU9qRXdNelU0TVN3aWMyVnhkV1Z1WTJsaGJFbHVjM1JoYkdGallXOGlPaklzSW5ObGNYVmxibU5wWVd4RGNtVmtaVzVqYVdGc0lqb3lMQ0poYldKcFpXNTBaU0k2SW5CeWIyUjFZMkZ2SWl3aWFXRjBJam94TnpRMk1ETXpOekkyTURjd25=',
      userBBsia: '',
      passwordBBsia: ''
    });
    setIsCreating(true);
  };

  const handleSave = () => {
    if (isEditing) {
      // Update existing connection
      setBankConnections(prev => prev.map(conn => 
        conn.id === editConnection.id ? { ...formValues, id: conn.id } : conn
      ));
    } else {
      // Create new connection
      const newId = bankConnections.length > 0 
        ? Math.max(...bankConnections.map(c => c.id)) + 1 
        : 1;
      setBankConnections(prev => [...prev, { ...formValues, id: newId }]);
    }
    
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleEdit = (connection) => {
    setEditConnection(connection);
    setFormValues({
      appKey: connection.appKey,
      clientId: connection.clientId,
      clientSecret: connection.clientSecret,
      registrarToken: connection.registrarToken,
      basic: connection.basic,
      userBBsia: connection.userBBsia,
      passwordBBsia: connection.passwordBBsia
    });
    setIsEditing(true);
  };

  const handleDelete = (connection) => {
    setConnectionToDelete(connection);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    setBankConnections(prev => prev.filter(conn => conn.id !== connectionToDelete.id));
    setShowDeleteDialog(false);
    setConnectionToDelete(null);
  };

  return (
    <div className="space-y-6">
      {!showBankConnections && !isEditing && !isCreating ? (
        <>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Gestão de Usuários</h3>
            <p className="text-sm text-gray-600 mb-3">Gerencie usuários e permissões do sistema</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                Adicionar Usuário
              </button>
              <button className="px-3 py-1 bg-white border border-blue-300 text-blue-600 text-sm rounded hover:bg-blue-50">
                Listar Usuários
              </button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Configurações do Sistema</h3>
            <p className="text-sm text-gray-600 mb-3">Ajuste configurações globais e parâmetros operacionais</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                Parâmetros Globais
              </button>
              <button 
                className="px-3 py-1 bg-white border border-blue-300 text-blue-600 text-sm rounded hover:bg-blue-50"
                onClick={handleBankConnectionsClick}
              >
                Conexões Bancárias
              </button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Auditoria</h3>
            <p className="text-sm text-gray-600 mb-3">Visualize logs e histórico de operações</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                Logs do Sistema
              </button>
              <button className="px-3 py-1 bg-white border border-blue-300 text-blue-600 text-sm rounded hover:bg-blue-50">
                Histórico de Transações
              </button>
            </div>
          </div>
        </>
      ) : showBankConnections && !isEditing && !isCreating ? (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-blue-800">Conexões Bancárias</h3>
            <div className="flex space-x-2">
              <Button 
                onClick={handleBackToMenu}
                variant="outline"
                className="text-sm"
              >
                Voltar
              </Button>
              <Button 
                onClick={handleCreateNew}
                className="bg-green-600 hover:bg-green-700"
              >
                Nova Conexão
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>App Key</TableHead>
                  <TableHead>Client ID</TableHead>
                  <TableHead>Usuário BBSIA</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bankConnections.map((connection) => (
                  <TableRow key={connection.id}>
                    <TableCell className="font-medium">{connection.id}</TableCell>
                    <TableCell>{connection.appKey.substring(0, 8)}...</TableCell>
                    <TableCell>{connection.clientId.substring(0, 8)}...</TableCell>
                    <TableCell>{connection.userBBsia || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(connection)}
                        >
                          <Edit size={14} className="mr-1" /> Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleDelete(connection)}
                        >
                          <TrashIcon size={14} className="mr-1" /> Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-blue-800">
              {isEditing ? 'Editar Conexão' : 'Nova Conexão'}
            </h3>
            <Button 
              onClick={handleBackToMenu}
              variant="outline"
              className="text-sm"
            >
              Cancelar
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                App Key
              </label>
              <Input 
                name="appKey"
                value={formValues.appKey}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client ID
              </label>
              <Input 
                name="clientId"
                value={formValues.clientId}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Secret
              </label>
              <Input 
                name="clientSecret"
                value={formValues.clientSecret}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registrar Token
              </label>
              <Input 
                name="registrarToken"
                value={formValues.registrarToken}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Basic Authentication
            </label>
            <Input 
              name="basic"
              value={formValues.basic}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuário BBSIA
              </label>
              <Input 
                name="userBBsia"
                value={formValues.userBBsia}
                onChange={handleInputChange}
                placeholder="Usuário para autenticação BBSIA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha BBSIA
              </label>
              <Input 
                name="passwordBBsia"
                type="password"
                value={formValues.passwordBBsia}
                onChange={handleInputChange}
                placeholder="Senha para autenticação BBSIA"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700"
            >
              {isEditing ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </div>
      )}
      
      {/* Diálogo de confirmação para exclusão de conexão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta conexão?
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
    </div>
  );
};

export default Index;
