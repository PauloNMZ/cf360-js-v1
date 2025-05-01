
import { useState } from "react";
import FormularioModerno from "@/components/FormularioModerno";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
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
  LayoutDashboard
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

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [formMode, setFormMode] = useState('view'); // view, create, edit

  const handleConvenenteClick = () => {
    console.log("Convenente button clicked");
    setModalOpen(true);
  };

  const handleLogoutClick = () => {
    console.log("Logout button clicked");
    // In a real application, this would handle the logout process
    alert("Saindo do sistema...");
  };

  const handleAdminPanelClick = () => {
    console.log("Admin Panel button clicked");
    setAdminPanelOpen(true);
  };

  const handleCreateNew = () => {
    setFormMode('create');
    console.log("Create new convenente");
  };

  const handleEdit = () => {
    setFormMode('edit');
    console.log("Edit convenente");
  };

  const handleDelete = () => {
    console.log("Delete convenente");
    // In a real application, this would show a confirmation dialog
    if (confirm("Deseja realmente excluir este convenente?")) {
      console.log("Convenente deleted");
    }
  };

  const handleSave = () => {
    console.log("Save convenente");
    setFormMode('view');
    // In a real application, this would save the data
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Header com gradiente azul */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">GERADOR DE PAGAMENTOS</h1>
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
            className="bg-red-50 hover:bg-red-100 border-red-200"
          />
        </div>
      </div>
      
      {/* Modal de Cadastro de Convenente */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-6">Cadastro de Convenente</DialogTitle>
            <div className="flex justify-between">
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
                  disabled={formMode === 'edit'}
                >
                  <Edit size={16} /> Editar
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <TrashIcon size={16} /> Excluir
                </Button>
              </div>
              {(formMode === 'create' || formMode === 'edit') && (
                <Button
                  onClick={handleSave}
                  variant="default"
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                >
                  <Save size={16} /> Salvar
                </Button>
              )}
            </div>
          </DialogHeader>
          <ScrollArea className="h-[70vh] pr-4">
            <div className="py-4">
              <FormularioModerno />
            </div>
          </ScrollArea>
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
      
      {/* Status bar - Fixed at the bottom */}
      <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Terça-Feira</h2>
            <p className="text-sm">29 de Abril de 2025</p>
          </div>
          <div className="text-right">
            <p className="text-sm">GeraPag 1.01</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Componente auxiliar para os botões de navegação
const NavButton = ({ icon, label, onClick, className = "" }) => {
  return (
    <button 
      className={`flex-shrink-0 w-24 h-24 bg-white hover:bg-blue-50 rounded-lg shadow-md transition-all hover:shadow-lg border border-blue-100 flex flex-col items-center justify-center p-3 ${className}`}
      onClick={onClick}
    >
      <div className="p-2 bg-blue-100 rounded-full text-blue-700 mb-1">
        {icon}
      </div>
      <span className="text-xs text-gray-800 text-center mt-1">{label}</span>
    </button>
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
                className="bg-green-600 hover:bg-green-700 text-sm flex items-center gap-1"
              >
                <Plus size={14} /> Nova Conexão
              </Button>
            </div>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>App Key</TableHead>
                  <TableHead>Client ID</TableHead>
                  <TableHead>Usuário BBsia</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bankConnections.map((connection) => (
                  <TableRow key={connection.id}>
                    <TableCell className="font-medium">{connection.appKey}</TableCell>
                    <TableCell>{connection.clientId.substring(0, 20)}...</TableCell>
                    <TableCell>{connection.userBBsia}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          onClick={() => handleEdit(connection)} 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1 h-8 px-2"
                        >
                          <Edit size={14} /> Editar
                        </Button>
                        <Button 
                          onClick={() => handleDelete(connection)} 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1 h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <TrashIcon size={14} /> Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {bankConnections.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                      Nenhuma conexão bancária cadastrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-blue-800">
              {isCreating ? 'Nova Conexão Bancária' : 'Editar Conexão Bancária'}
            </h3>
            <Button 
              onClick={handleBackToMenu}
              variant="outline"
              className="text-sm"
            >
              Cancelar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">App Key</label>
              <Input 
                name="appKey" 
                value={formValues.appKey} 
                onChange={handleInputChange} 
                className="border-blue-200 focus:border-blue-500 bg-blue-50" 
              />
            </div>
            
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Client ID</label>
              <Input 
                name="clientId" 
                value={formValues.clientId} 
                onChange={handleInputChange} 
                className="border-blue-200 focus:border-blue-500 bg-blue-50" 
              />
            </div>
            
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Client Secret</label>
              <Input 
                name="clientSecret" 
                value={formValues.clientSecret} 
                onChange={handleInputChange} 
                className="border-blue-200 focus:border-blue-500 bg-blue-50" 
              />
            </div>
            
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Registrar Token</label>
              <Input 
                name="registrarToken" 
                value={formValues.registrarToken} 
                onChange={handleInputChange} 
                className="border-blue-200 focus:border-blue-500 bg-blue-50" 
              />
            </div>
            
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Basic</label>
              <Input 
                name="basic" 
                value={formValues.basic} 
                onChange={handleInputChange} 
                className="border-blue-200 focus:border-blue-500 bg-blue-50" 
              />
            </div>
            
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Usuário BBsia</label>
              <Input 
                name="userBBsia" 
                value={formValues.userBBsia} 
                onChange={handleInputChange} 
                className="border-blue-200 focus:border-blue-500 bg-blue-50" 
              />
            </div>
            
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Senha BBsia</label>
              <Input 
                name="passwordBBsia" 
                value={formValues.passwordBBsia} 
                onChange={handleInputChange} 
                type="password"
                className="border-blue-200 focus:border-blue-500 bg-blue-50" 
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Save size={16} /> Salvar
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation dialog for deletion */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta conexão bancária?
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
