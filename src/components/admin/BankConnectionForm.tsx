
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BankConnectionFormValues {
  appKey: string;
  clientId: string;
  clientSecret: string;
  registrarToken: string;
  basic: string;
  userBBsia: string;
  passwordBBsia: string;
}

interface BankConnectionFormProps {
  isEditing: boolean;
  formValues: BankConnectionFormValues;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const BankConnectionForm: React.FC<BankConnectionFormProps> = ({
  isEditing,
  formValues,
  onInputChange,
  onSave,
  onCancel,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-blue-800">
          {isEditing ? "Editar Conexão" : "Nova Conexão"}
        </h3>
        <Button onClick={onCancel} variant="outline" className="text-sm">
          Cancelar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">App Key</label>
          <Input name="appKey" value={formValues.appKey} onChange={onInputChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
          <Input name="clientId" value={formValues.clientId} onChange={onInputChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client Secret</label>
          <Input name="clientSecret" value={formValues.clientSecret} onChange={onInputChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Registrar Token</label>
          <Input name="registrarToken" value={formValues.registrarToken} onChange={onInputChange} />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Basic Authentication</label>
        <Input name="basic" value={formValues.basic} onChange={onInputChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Usuário BBSIA</label>
          <Input
            name="userBBsia"
            value={formValues.userBBsia}
            onChange={onInputChange}
            placeholder="Usuário para autenticação BBSIA"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha BBSIA</label>
          <Input
            name="passwordBBsia"
            type="password"
            value={formValues.passwordBBsia}
            onChange={onInputChange}
            placeholder="Senha para autenticação BBSIA"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
          {isEditing ? "Atualizar" : "Salvar"}
        </Button>
      </div>
    </div>
  );
};

export default BankConnectionForm;
