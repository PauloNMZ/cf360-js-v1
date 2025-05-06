
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { ConvenenteCredentials } from "@/types/credenciais";
import { useCredenciaisForm } from "@/hooks/convenente/useCredenciaisForm";

interface ConvenenteCredentialsSectionProps {
  convenenteId: string | null;
  onSuccess?: () => void;
}

const ConvenenteCredentialsSection: React.FC<ConvenenteCredentialsSectionProps> = ({
  convenenteId,
  onSuccess
}) => {
  const {
    formValues,
    isLoading,
    isEditing,
    handleInputChange,
    handleSave,
    handleCancel
  } = useCredenciaisForm({ convenenteId, onSuccess });

  if (!convenenteId) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-gray-500 text-center">
          Selecione um convenente para gerenciar as credenciais de API.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-blue-800">
          {isEditing ? "Editar Credenciais de API" : "Novas Credenciais de API"}
        </h3>
        <Button onClick={handleCancel} variant="outline" className="text-sm">
          Cancelar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">App Key</label>
          <Input 
            name="appKey" 
            value={formValues.appKey || ''} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
          <Input 
            name="clientId" 
            value={formValues.clientId || ''} 
            onChange={handleInputChange} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client Secret</label>
          <Input 
            name="clientSecret" 
            value={formValues.clientSecret || ''} 
            onChange={handleInputChange} 
            type="password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Registrar Token</label>
          <Input 
            name="registrarToken" 
            value={formValues.registrarToken || ''} 
            onChange={handleInputChange} 
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Basic Authentication</label>
        <Input 
          name="basic" 
          value={formValues.basic || ''} 
          onChange={handleInputChange} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Usuário BBSIA</label>
          <Input
            name="userBBsia"
            value={formValues.userBBsia || ''}
            onChange={handleInputChange}
            placeholder="Usuário para autenticação BBSIA"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha BBSIA</label>
          <Input
            name="passwordBBsia"
            type="password"
            value={formValues.passwordBBsia || ''}
            onChange={handleInputChange}
            placeholder="Senha para autenticação BBSIA"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          className="bg-green-600 hover:bg-green-700"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Atualizar" : "Salvar"}
        </Button>
      </div>
    </div>
  );
};

export default ConvenenteCredentialsSection;
