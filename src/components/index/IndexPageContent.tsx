
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import NavigationMenu from "@/components/navigation/NavigationMenu";
import { useIndexPageContext } from "@/providers/IndexPageProvider";
import { IndexPageModals } from "./IndexPageModals";

const IndexPageContent = () => {
  const {
    companySettings,
    handleConvenenteClick,
    handleImportarPlanilhaClick,
    handleCnabToApiClick,
    handleAdminPanelClick,
    handleLogoutClick,
  } = useIndexPageContext();

  return (
    <MainLayout companySettings={companySettings || { logoUrl: '', companyName: 'Gerador de Pagamentos' }}>
      <div className="w-full px-4 py-6">
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
    </MainLayout>
  );
};

export default IndexPageContent;
