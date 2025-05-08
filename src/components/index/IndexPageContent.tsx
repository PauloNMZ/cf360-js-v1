
import React from "react";
import NavigationMenu from "@/components/navigation/NavigationMenu";
import { useIndexPageContext } from "@/hooks/useIndexPageContext";
import { IndexPageModals } from "./IndexPageModals";
import { DEFAULT_SETTINGS } from "@/services/companySettings";

const IndexPageContent = () => {
  const {
    companySettings,
    handleConvenenteClick,
    handleImportarPlanilhaClick,
    handleCnabToApiClick,
    handleAdminPanelClick,
    handleLogoutClick
  } = useIndexPageContext();
  
  // Use a safe version of company settings to prevent undefined errors
  const safeCompanySettings = companySettings || DEFAULT_SETTINGS;

  return (
    <div className="w-full px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <NavigationMenu 
          onConvenenteClick={handleConvenenteClick}
          onImportarPlanilhaClick={handleImportarPlanilhaClick}
          onCnabToApiClick={handleCnabToApiClick}
          onAdminPanelClick={handleAdminPanelClick}
          onLogoutClick={handleLogoutClick}
        />
      </div>

      {/* Include all modals as a separate component */}
      <IndexPageModals />
    </div>
  );
};

export default IndexPageContent;
