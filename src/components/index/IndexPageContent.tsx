
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import NavigationMenu from "@/components/navigation/NavigationMenu";
import { useIndexPageContext } from "@/hooks/useIndexPageContext";
import { IndexPageModals } from "./IndexPageModals";
import { Shield } from "lucide-react";
import { hasCredentials } from "@/services/convenente/credenciaisService";
import { ConvenenteData } from "@/types/convenente";
import { DEFAULT_SETTINGS } from "@/services/companySettings";

const IndexPageContent = () => {
  const {
    companySettings,
    handleConvenenteClick,
    handleImportarPlanilhaClick,
    handleCnabToApiClick,
    handleAdminPanelClick,
    handleLogoutClick,
    convenentes
  } = useIndexPageContext();
  
  const [convenentesWithCredentials, setConvenentesWithCredentials] = useState<Record<string, boolean>>({});
  
  // Verificar quais convenentes têm credenciais configuradas
  useEffect(() => {
    const checkCredentials = async () => {
      const result: Record<string, boolean> = {};
      
      // Verificar apenas os convenentes carregados
      for (const convenente of convenentes) {
        if (convenente.id) {
          const hasCredentialsValue = await hasCredentials(convenente.id);
          result[convenente.id] = hasCredentialsValue;
        }
      }
      
      setConvenentesWithCredentials(result);
    };
    
    if (convenentes.length > 0) {
      checkCredentials();
    }
  }, [convenentes]);

  // Use a safe version of company settings to prevent undefined errors
  const safeCompanySettings = companySettings || DEFAULT_SETTINGS;

  // Contagem de convenentes com credenciais
  const credentialsCount = Object.values(convenentesWithCredentials).filter(Boolean).length;

  return (
    <MainLayout companySettings={safeCompanySettings}>
      <div className="w-full px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <NavigationMenu 
            onConvenenteClick={handleConvenenteClick}
            onImportarPlanilhaClick={handleImportarPlanilhaClick}
            onCnabToApiClick={handleCnabToApiClick}
            onAdminPanelClick={handleAdminPanelClick}
            onLogoutClick={handleLogoutClick}
          />
          
          {/* Estatísticas de credenciais */}
          {convenentes.length > 0 && (
            <div className="bg-blue-50 px-4 py-2 rounded-lg flex items-center space-x-2">
              <Shield className={`${credentialsCount > 0 ? 'text-green-500' : 'text-orange-400'}`} />
              <div>
                <span className="text-sm font-medium">
                  {credentialsCount} de {convenentes.length} convenentes {credentialsCount === 1 ? 'possui' : 'possuem'} credenciais
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Include all modals as a separate component */}
      <IndexPageModals />
    </MainLayout>
  );
};

export default IndexPageContent;
