import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
import { Edit, TrashIcon, Upload, WalletCards } from "lucide-react";
import { getCompanySettings, saveCompanySettings } from "@/services/companySettings";
import { useToast } from "@/components/ui/use-toast";

interface AdminPanelProps {
  onClose?: () => void;
}

const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showBankConnections, setShowBankConnections] = useState(false);
  const [showCompanySettings, setShowCompanySettings] = useState(false);
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
  const [companySettings, setCompanySettings] = useState({
    logoUrl: '',
    companyName: 'GERADOR DE PAGAMENTOS'
  });
  const [logoPreview, setLogoPreview] = useState('');
  const [formValues, setFormValues] = useState({
    appKey: '51f3e692d4f797199a0caa25c4784f3a',
    clientId: 'eyJpZCI6IjY8&3NjZmOTctNmM5My0iLCJjb2RpZ29QdWJsaWNhZG9yIjowLCJjb2RpZ29Tb2Z0d2FyZSI6MTAzNTgxLCJzZXF1ZW5jaWFsSW5zdGFsYWNhbyI6Mn0',
    clientSecret: 'eyJpZCI6ImI1ODgyZWYtYWJlNi00NTMwLWExNGQtMTdjZDZjZDU0NWEyMTBmMGYxZDEtIiwiY29kaWdvUHVibGljYWRvciI6MCwiY29kaWdvU29mdHdhcmUiOjEwMzU4MSwic2VxdWVuY2lhbEluc3RhbGFjYW8iOjIsInNlcXVlbmNpYWxDcmVkZW5jaWFsIjoyLCJhbWJpZW50ZSI6InByb2R1Y2FvIiwiaWF0IjoxNzQ2MDMzNzI2MDcwfQ',
    registrarToken: 'eyJpZCI6IjViOTIzMTM0LWZjZDktNDNhZS1hOWUxLWI2NDVlODJkMzM4NiIsImNvZGlnb1NvZnR3YXJlIjoxMDM1ODEsInNlcXVlbmNpYWxJbnN0YWxhY2FvIjowLCJzZXF1ZW5jaWFsVG9rZW4iOjEsImNvZGlnb1RpcG9Ub2tlbiI6MiwiYW1iaWVudGUiOiJwcm9kdWNhbyIsImlhdCI6MTc0NjAzMzcyNjAzMn0',
    basic: 'ZXlKcFpDSTZJalkzTmpabU9UY3RObU01TXkwaUxDSmpiMlJwWjI5UWRXSnNhV05oWkc5eUlqb3dMQ0pqYjJScFoyOVRiMlowZDJGeVpTSTZNVEF6TlRneExDSnpaWEYxWlc1amFXRnNTVzV6ZEdGc1lXTmhieUk2TW4wOmV5SnBaQ0k2SW1JMU9EZ3laV1l0WVdKbE5pMDByVE13TFdFeE5HUXRNVGRqWkRaalpEVTBOV0V5TVRCbU1HWXhaREV0SWl3aVkyOWthV2R2VUhWaWJHbGpZV1J2Y2lJNk1Dd2lZMjlreFdkdlUyOW1kSGRoY21VaU9qRXdNelU0TVN3aWMyVnhkV1Z1WTJsaGJFbHVjM1JoYkdGallXOGlPaklzSW5ObGNYVmxibU5wWVd4RGNtVmtaVzVqYVdGc0lqb3lMQ0poYldKcFpXNTBaU0k2SW5CeWIyUjFZMkZ2SWl3aWFXRjBJam94TnpRMk1ETXpOekkyTURjd25=',
    userBBsia: '',
    passwordBBsia: ''
  });

  // Load company settings on component mount
  useEffect(() => {
    const settings = getCompanySettings();
    setCompanySettings(settings);
    setLogoPreview(settings.logoUrl);
  }, []);

  const handleBankConnectionsClick = () => {
    setShowBankConnections(true);
    setShowCompanySettings(false);
  };

  const handleCompanySettingsClick = () => {
    setShowCompanySettings(true);
    setShowBankConnections(false);
  };

  const handleBackToMenu = () => {
    setShowBankConnections(false);
    setShowCompanySettings(false);
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

  const handleCompanySettingChange = (e) => {
    const { name, value } = e.target;
    setCompanySettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Updated to use the fileInputRef
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setLogoPreview(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Modified to call onClose when toast is shown
  const handleSaveCompanySettings = () => {
    const updatedSettings = {
      ...companySettings,
      logoUrl: logoPreview
    };
    saveCompanySettings(updatedSettings);
    toast({
      title: "Configurações salvas",
      description: "As configurações da empresa foram atualizadas com sucesso.",
      onDismiss: onClose
    });
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
      {!showBankConnections && !showCompanySettings && !isEditing && !isCreating ? (
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
              <button 
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                onClick={handleCompanySettingsClick}
              >
                Configurações da Empresa
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
      ) : showCompanySettings ? (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-blue-800">Configurações da Empresa</h3>
            <Button 
              onClick={handleBackToMenu}
              variant="outline"
              className="text-sm"
            >
              Voltar
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Empresa
                </label>
                <Input 
                  name="companyName"
                  value={companySettings.companyName}
                  onChange={handleCompanySettingChange}
                  placeholder="Nome que aparecerá no cabeçalho"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo da Empresa
                </label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="flex-1"
                    ref={fileInputRef}
                  />
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={handleLogoButtonClick}
                  >
                    <Upload size={16} /> Carregar
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Recomendamos uma imagem quadrada com pelo menos 128x128 pixels.
                </p>
              </div>

              <Button 
                onClick={handleSaveCompanySettings}
                className="bg-green-600 hover:bg-green-700 mt-4"
              >
                Salvar Configurações
              </Button>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-sm font-medium text-gray-700 mb-4">Pré-visualização do Logo</div>
              <div className="border border-gray-200 rounded-lg p-6 bg-slate-50 flex flex-col items-center">
                <div className="mb-4">
                  {logoPreview ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-600 rounded-full blur-sm opacity-30"></div>
                      <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 rounded-full text-white flex items-center justify-center shadow-lg">
                        <img 
                          src={logoPreview} 
                          alt="Company Logo Preview" 
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-600 rounded-full blur-sm opacity-30"></div>
                      <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 rounded-full text-white flex items-center justify-center shadow-lg">
                        <WalletCards size={64} strokeWidth={1.5} className="drop-shadow-sm" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-xl font-bold text-center text-blue-800">
                  {companySettings.companyName}
                </div>
              </div>
              {logoPreview && (
                <Button 
                  variant="outline" 
                  className="text-red-600 mt-4"
                  onClick={() => {
                    setLogoPreview('');
                    setCompanySettings(prev => ({ ...prev, logoUrl: '' }));
                  }}
                >
                  Remover Logo
                </Button>
              )}
            </div>
          </div>
        </div>
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

export default AdminPanel;
