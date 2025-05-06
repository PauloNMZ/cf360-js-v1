
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, WalletCards } from "lucide-react";

interface CompanySettingsProps {
  companySettings: {
    logoUrl: string;
    companyName: string;
  };
  logoPreview: string;
  onCompanySettingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveSettings: () => void;
  onBack: () => void;
}

const CompanySettingsSection: React.FC<CompanySettingsProps> = ({
  companySettings,
  logoPreview,
  onCompanySettingChange,
  onLogoChange,
  onSaveSettings,
  onBack,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-blue-800">Configurações da Empresa</h3>
        <Button onClick={onBack} variant="outline" className="text-sm">
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
              onChange={onCompanySettingChange}
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
                onChange={onLogoChange}
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
            onClick={onSaveSettings}
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
                onCompanySettingChange({
                  target: { name: "logoUrl", value: "" },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
            >
              Remover Logo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanySettingsSection;
