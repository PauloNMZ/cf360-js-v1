import React, { useState, useEffect } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { getCompanySettings, saveCompanySettings } from "@/services/companySettings";
import { useToast } from "@/components/ui/use-toast";
import AdminMenu from "@/components/admin/AdminMenu";
import CompanySettingsSection from "@/components/admin/CompanySettingsSection";
import BankConnectionsList from "@/components/admin/BankConnectionsList";
import BankConnectionForm from "@/components/admin/BankConnectionForm";
import APIManagementTable from "@/components/admin/api/APIManagementTable";
import { useAPIManagement } from "@/hooks/admin/useAPIManagement";

interface AdminPanelProps {
  onClose?: () => void;
}

const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const { toast } = useToast();
  const [showBankConnections, setShowBankConnections] = useState(false);
  const [showCompanySettings, setShowCompanySettings] = useState(false);
  const [showAPIManagement, setShowAPIManagement] = useState(false);
  
  // API Management hook
  const {
    apis,
    addAPI,
    editAPI,
    deleteAPI,
    rotateCredentials,
    toggleAPIStatus
  } = useAPIManagement();

  // ... keep existing code (bank connections state and handlers)
  const [bankConnections, setBankConnections] = useState([
    { 
      id: 1, 
      appKey: '51f3e692d4f797199a0caa25c4784f3a', 
      clientId: 'eyJpZCI6IjY8&3NjZmOTctNmM5My0iLCJjb2RpZ29QdWJsaWNhZG9yIjowLCJjb2RpZ29Tb2Z0d2FyZSI6MTAzNTgxLCJzZXF1ZW5jaWFsSW5zdGFsYWNhbyI6Mn0', 
      clientSecret: 'eyJpZCI6ImI1ODgyZWYtYWJlNi00NTMwLWExNGQtMTdjZDZjZDU0NWEyMTBmMGYxZDEtIiwiY29kaWdvUHVibGljYWRvciI6MCwiY29kaWdvU29mdHdhcmUiOjEwMzU4MSwic2VxdWVuY2lhbEluc3RhbGFjYW8iOjIsInNlcXVlbmNpYWxDcmVkZW5jaWFsIjoyLCJhbWJpZW50ZSI6InByb2R1Y2FvIiwiaWF0IjoxNzQ2MDMzNzI2MDcwfQ',
      registrarToken: 'eyJpZCI6IjViOTIzMTM0LWZjZDktNDNhZS1hOWUxLWI2NDVlODJkMzM4NiIsImNvZGlnb1NvZnR3YXJlIjoxMDM1ODEsInNlcXVlbmNpYWxJbnN0YWxhY2FvIjowLCJzZXF1ZW5jaWFsVG9rZW4iOjEsImNvZGlnb1RpcG9Ub2tlbiI6MiwiYW1iaWVudGUiOiJwcm9kdWNhbyIsImlhdCI6MTc0NjAzMzcyNjAzMn0',
      basic: 'ZXlKcFpDSTZJalkzTmpabU9UY3RObU01TXkwaUxDSmpiMlJwWjI5UWRXSnNhV05oWkc5eUlqb3dMQ0pqYjJScFoyOVRiMlowZDJGeVpTSTZNVEF6TlRneExDSnpaWEYxWlc1amFXRnNTVzV6ZEdGc1lXTmhieUk2TW4wOmV5SnBaQ0k2SW1JMU9EZ3laV1l0WVdKbE5pMDByVE13TFdFeE5HUXRNVGRqWkRaalpEVTBOV0V5TVRCbU1HWXhaREV0SWl3aVkyOWthV2R2VUhWaWJHbGpZV1J2Y2lJNk1Dd2lZMjlreFdkdlUyOW1kSGRoY21VaU9qRXdNelU0TVN3aWMyVnhkV1Z1WTJsaGJFbHVjM1RoYkdGamRXNWtJam95TENKaGJXSnBaVzUwWlNJNklsOXFZWEoxWlMxd2JHOWhaR3dpSUhzSw==',
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
    basic: 'ZXlKcFpDSTZJalkzTmpabU9UY3RObU01TXkwaUxDSmpiMlJwWjI5UWRXSnNhV05oWkc5eUlqb3dMQ0pqYjJScFoyOVRiMlowZDJHeVpTSTZNVEF6TlRneExDSnpaWEYxWlc1amFXRnNTVzV6ZEdGc1lXTmhieUk2TW4wOmV5SnBaQ0k2SW1JMU9EZ3laV1l0WVdKbE5pMDByVE13TFdFeE5HUXRNVGRqWkRaalpEVTBOV0V5TVRCbU1HWXhaREV0SWl3aVkyOWthV2R2VUhWaWJHbGpZV1J2Y2lJNk1Dd2lZMjlreFdkdlUyOW1kSGRoY21VaU9qRXdNelU0TVN3aWMyVnhkV1Z1WTJsaGJFbHVjM1RoYkdGamRXNWtJam95TENKaGJXSnBaVzUwWlNJNklsOXFZWEoxWlMxd2JHOWhaR3dpSUhzSw==',
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
    setShowAPIManagement(false);
  };

  const handleCompanySettingsClick = () => {
    setShowCompanySettings(true);
    setShowBankConnections(false);
    setShowAPIManagement(false);
  };

  const handleAPIManagementClick = () => {
    setShowAPIManagement(true);
    setShowBankConnections(false);
    setShowCompanySettings(false);
  };

  const handleBackToMenu = () => {
    setShowBankConnections(false);
    setShowCompanySettings(false);
    setShowAPIManagement(false);
    setIsEditing(false);
    setIsCreating(false);
  };

  // ... keep existing code (all the bank connection handlers and company settings handlers)
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

  const handleSaveCompanySettings = () => {
    const updatedSettings = {
      ...companySettings,
      logoUrl: logoPreview
    };
    saveCompanySettings(updatedSettings);
    toast({
      title: "Configurações salvas",
      description: "As configurações da empresa foram atualizadas com sucesso.",
    });
    handleBackToMenu();
  };

  const handleCreateNew = () => {
    setFormValues({
      appKey: '51f3e692d4f797199a0caa25c4784f3a',
      clientId: 'eyJpZCI6IjY8&3NjZmOTctNmM5My0iLCJjb2RpZ29QdWJsaWNhZG9yIjowLCJjb2RpZ29Tb2Z0d2FyZSI6MTAzNTgxLCJzZXF1ZW5jaWFsSW5zdGFsYWNhbyI6Mn0',
      clientSecret: 'eyJpZCI6ImI1ODgyZWYtYWJlNi00NTMwLWExNGQtMTdjZDZjZDU0NWEyMTBmMGYxZDEtIiwiY29kaWdvUHVibGljYWRvciI6MCwiY29kaWdvU29mdHdhcmUiOjEwMzU4MSwic2VxdWVuY2lhbEluc3RhbGFjYW8iOjIsInNlcXVlbmNpYWxDcmVkZW5jaWFsIjoyLCJhbWJpZW50ZSI6InByb2R1Y2FvIiwiaWF0IjoxNzQ2MDMzNzI2MDcwfQ',
      registrarToken: 'eyJpZCI6IjViOTIzMTM0LWZjZDktNDNhZS1hOWUxLWI2NDVlODJkMzM4NiIsImNvZGlnb1NvZnR3YXJlIjoxMDM1ODEsInNlcXVlbmNpYWxJbnN0YWxhY2FvIjowLCJzZXF1ZW5jaWFsVG9rZW4iOjEsImNvZGlnb1RpcG9Ub2tlbiI6MiwiYW1iaWVudGUiOiJwcm9kdWNhbyIsImlhdCI6MTc0NjAzMzcyNjAzMn0',
      basic: 'ZXlKcFpDSTZJalkzTmpabU9UY3RObU01TXkwaUxDSmpiMlJwWjI5UWRXSnNhV05oWkc5eUlqb3dMQ0pqYjJScFoyOVRiMlowZDJHeVpTSTZNVEF6TlRneExDSnpaWEYxWlc1amFXRnNTVzV6ZEdGc1lXTmhieUk2TW4wOmV5SnBaQ0k2SW1JMU9EZ3laV1l0WVdKbE5pMDByVE13TFdFeE5HUXRNVGRqWkRaalpEVTBOV0V5TVRCbU1HWXhaREV0SWl3aVkyOWthV2R2VUhWaWJHbGpZV1J2Y2lJNk1Dd2lZMjlreFdkdlUyOW1kSGRoY21VaU9qRXdNelU0TVN3aWMyVnhkV1Z1WTJsaGJFbHVjM1RoYkdGamRXNWtJam95TENKaGJXSnBaVzUwWlNJNklsOXFZWEoxWlMxd2JHOWhaR3dpSUhzSw==',
      userBBsia: '',
      passwordBBsia: ''
    });
    setIsCreating(true);
  };

  const handleSave = () => {
    if (isEditing) {
      setBankConnections(prev => prev.map(conn => 
        conn.id === editConnection.id ? { ...formValues, id: conn.id } : conn
      ));
    } else {
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
      {!showBankConnections && !showCompanySettings && !showAPIManagement && !isEditing && !isCreating ? (
        <AdminMenu 
          onBankConnectionsClick={handleBankConnectionsClick}
          onCompanySettingsClick={handleCompanySettingsClick}
          onAPIManagementClick={handleAPIManagementClick}
        />
      ) : showCompanySettings ? (
        <CompanySettingsSection
          companySettings={companySettings}
          logoPreview={logoPreview}
          onCompanySettingChange={handleCompanySettingChange}
          onLogoChange={handleLogoChange}
          onSaveSettings={handleSaveCompanySettings}
          onBack={handleBackToMenu}
        />
      ) : showAPIManagement ? (
        <div>
          <div className="mb-4">
            <Button variant="outline" onClick={handleBackToMenu}>
              ← Voltar ao Menu
            </Button>
          </div>
          <APIManagementTable
            apis={apis}
            onAddAPI={addAPI}
            onEditAPI={editAPI}
            onDeleteAPI={deleteAPI}
            onRotateCredentials={rotateCredentials}
            onToggleStatus={toggleAPIStatus}
          />
        </div>
      ) : showBankConnections && !isEditing && !isCreating ? (
        <BankConnectionsList
          bankConnections={bankConnections}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreateNew={handleCreateNew}
          onBack={handleBackToMenu}
        />
      ) : (
        <BankConnectionForm
          isEditing={isEditing}
          formValues={formValues}
          onInputChange={handleInputChange}
          onSave={handleSave}
          onCancel={handleBackToMenu}
        />
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
