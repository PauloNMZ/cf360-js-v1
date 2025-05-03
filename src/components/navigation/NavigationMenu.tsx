
import React from "react";
import { NavButton } from "@/components/ui/NavButton";
import { 
  Home, 
  FileUp, 
  FileSearch, 
  Send, 
  RefreshCw, 
  FileText, 
  Search, 
  LogOut,
  Shield,
  LayoutDashboard
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NavigationMenuProps = {
  onConvenenteClick: () => void;
  onImportarPlanilhaClick: () => void;
  onAdminPanelClick: () => void;
  onLogoutClick: () => void;
};

const NavigationMenu = ({
  onConvenenteClick,
  onImportarPlanilhaClick,
  onAdminPanelClick,
  onLogoutClick
}: NavigationMenuProps) => {
  return (
    <TooltipProvider>
      <div className="flex justify-center mb-8">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2 max-w-5xl mx-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <NavButton 
                  icon={<Home size={24} />} 
                  label="Convenente" 
                  onClick={onConvenenteClick} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Acesso ao cadastro e gerenciamento de convenentes</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <NavButton 
                  icon={<FileUp size={24} />} 
                  label="Up Planilhas" 
                  onClick={onImportarPlanilhaClick} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Importação de planilhas para processamento</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <NavButton 
                  icon={<FileSearch size={24} />} 
                  label="Check" 
                  onClick={() => {}} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Verificação de erros nos registros importados</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <NavButton 
                  icon={<Send size={24} />} 
                  label="Remessa" 
                  onClick={() => {}} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Envio de arquivos de remessa ao banco</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <NavButton 
                  icon={<RefreshCw size={24} />} 
                  label="Retornos" 
                  onClick={() => {}} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Processamento de arquivos de retorno bancário</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <NavButton 
                  icon={<FileText size={24} />} 
                  label="Comprovantes" 
                  onClick={() => {}} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Visualização e download de comprovantes</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <NavButton 
                  icon={<Search size={24} />} 
                  label="Consultas" 
                  onClick={() => {}} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Consulta de registros e operações</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <NavButton 
                  icon={<LayoutDashboard size={24} />} 
                  label="Dashboard" 
                  onClick={() => {}} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Acesso ao painel de controle e estatísticas</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <NavButton 
                  icon={<Shield size={24} />} 
                  label="Setup" 
                  onClick={onAdminPanelClick} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Configurações do sistema e parâmetros</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <NavButton 
                  icon={<LogOut size={24} />} 
                  label="Sair" 
                  onClick={onLogoutClick} 
                  className="bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900 border-red-200 dark:border-red-800"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Encerrar sessão e sair do sistema</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default NavigationMenu;
