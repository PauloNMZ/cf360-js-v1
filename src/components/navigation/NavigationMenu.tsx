
import React from "react";
import { NavButton } from "@/components/ui/NavButton";
import { 
  Home, 
  CloudUpload, 
  Send, 
  RefreshCw, 
  FileText, 
  Search, 
  LogOut,
  Shield,
  FileSpreadsheet,
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIndexPageContext } from "@/hooks/useIndexPageContext";

type NavigationMenuProps = {
  onConvenenteClick: () => void;
  onImportarPlanilhaClick: () => void;
  onCnabToApiClick: () => void;
  onAdminPanelClick: () => void;
  onLogoutClick: () => void;
};

const NavigationMenu = ({
  onConvenenteClick,
  onImportarPlanilhaClick,
  onCnabToApiClick,
  onAdminPanelClick,
  onLogoutClick
}: NavigationMenuProps) => {
  const { isDeleting, isLoading } = useIndexPageContext();
  
  // Determine if actions are allowed
  const actionsDisabled = isDeleting || isLoading;
  
  // Create safe handler wrappers that return a function with no parameters
  const handleSafeClick = (handler: () => void) => () => {
    if (actionsDisabled) {
      console.log("Navigation action blocked: Operation in progress");
      return;
    }
    handler();
  };

  return (
    <TooltipProvider>
      <div className="flex justify-center mb-10">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-4 max-w-6xl mx-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <NavButton 
                  icon={<Home size={24} />} 
                  label="Empresa" 
                  onClick={handleSafeClick(onConvenenteClick)}
                  disabled={actionsDisabled}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-blue-50 dark:bg-blue-900/80 border border-blue-200 dark:border-blue-800">
              <p>Acesso ao cadastro e gerenciamento de convenentes</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <NavButton 
                  icon={<FileSpreadsheet size={24} />} 
                  label="Planilha" 
                  onClick={handleSafeClick(onImportarPlanilhaClick)}
                  disabled={actionsDisabled}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-blue-50 dark:bg-blue-900/80 border border-blue-200 dark:border-blue-800">
              <p>Importação de planilhas para processamento</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <NavButton 
                  icon={<Send size={24} />} 
                  label="CNAB2API" 
                  onClick={handleSafeClick(onCnabToApiClick)}
                  disabled={actionsDisabled}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-blue-50 dark:bg-blue-900/80 border border-blue-200 dark:border-blue-800">
              <p>Converter arquivo CNAB para requisição JSON para API</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <NavButton 
                  icon={<CloudUpload size={24} />} 
                  label="Remessa" 
                  onClick={handleSafeClick(() => {})}
                  disabled={actionsDisabled}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-blue-50 dark:bg-blue-900/80 border border-blue-200 dark:border-blue-800">
              <p>Envio de arquivos de remessa ao banco</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <NavButton 
                  icon={<RefreshCw size={24} />} 
                  label="Retornos" 
                  onClick={handleSafeClick(() => {})}
                  disabled={actionsDisabled}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-blue-50 dark:bg-blue-900/80 border border-blue-200 dark:border-blue-800">
              <p>Processamento de arquivos de retorno bancário</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <NavButton 
                  icon={<FileText size={24} />} 
                  label="Comprovantes" 
                  onClick={handleSafeClick(() => {})}
                  disabled={actionsDisabled}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-blue-50 dark:bg-blue-900/80 border border-blue-200 dark:border-blue-800">
              <p>Visualização e download de comprovantes</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <NavButton 
                  icon={<Search size={24} />} 
                  label="Consultas" 
                  onClick={handleSafeClick(() => {})}
                  disabled={actionsDisabled} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-blue-50 dark:bg-blue-900/80 border border-blue-200 dark:border-blue-800">
              <p>Consulta de registros e operações</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <NavButton 
                  icon={<Shield size={24} />} 
                  label="Setup" 
                  onClick={handleSafeClick(onAdminPanelClick)}
                  disabled={actionsDisabled}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-blue-50 dark:bg-blue-900/80 border border-blue-200 dark:border-blue-800">
              <p>Configurações do sistema e parâmetros</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <NavButton 
                  icon={<LogOut size={24} />} 
                  label="Sair" 
                  onClick={handleSafeClick(onLogoutClick)} 
                  disabled={actionsDisabled}
                  className={`bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900 border-red-200 dark:border-red-800 ${actionsDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-red-50 dark:bg-red-900/80 border border-red-200 dark:border-red-800">
              <p>Encerrar sessão e sair do sistema</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default NavigationMenu;
