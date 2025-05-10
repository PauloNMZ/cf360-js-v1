
import React from "react";
import { useIndexPageContext } from "@/hooks/useIndexPageContext";
import { IndexPageModals } from "./IndexPageModals";
import { DEFAULT_SETTINGS } from "@/services/companySettings";
import { TooltipProvider } from "@/components/ui/tooltip";

const IndexPageContent = () => {
  const {
    companySettings
  } = useIndexPageContext();
  
  // Use a safe version of company settings to prevent undefined errors
  const safeCompanySettings = companySettings || DEFAULT_SETTINGS;

  return (
    <TooltipProvider>
      <div className="w-full px-4 py-6">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">Bem-vindo ao sistema Connect Pag</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Selecione uma opção no menu lateral para começar
            </p>
          </div>
        </div>

        {/* Include all modals as a separate component */}
        <IndexPageModals />
      </div>
    </TooltipProvider>
  );
};

export default IndexPageContent;
