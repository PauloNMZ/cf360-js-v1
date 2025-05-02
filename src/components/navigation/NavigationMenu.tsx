
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
    <div className="flex justify-center mb-8">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2 max-w-5xl mx-auto">
        <NavButton 
          icon={<Home size={24} />} 
          label="Convenente" 
          onClick={onConvenenteClick} 
        />
        <NavButton 
          icon={<FileUp size={24} />} 
          label="Importar Planilha" 
          onClick={onImportarPlanilhaClick} 
        />
        <NavButton 
          icon={<FileSearch size={24} />} 
          label="Verificar Erros" 
          onClick={() => {}} 
        />
        <NavButton 
          icon={<Send size={24} />} 
          label="Enviar ao Banco" 
          onClick={() => {}} 
        />
        <NavButton 
          icon={<RefreshCw size={24} />} 
          label="Processar Retornos" 
          onClick={() => {}} 
        />
        <NavButton 
          icon={<FileText size={24} />} 
          label="Comprovantes" 
          onClick={() => {}} 
        />
        <NavButton 
          icon={<Search size={24} />} 
          label="Consultas" 
          onClick={() => {}} 
        />
        <NavButton 
          icon={<LayoutDashboard size={24} />} 
          label="Dashboard" 
          onClick={() => {}} 
        />
        <NavButton 
          icon={<Shield size={24} />} 
          label="Setup" 
          onClick={onAdminPanelClick} 
        />
        <NavButton 
          icon={<LogOut size={24} />} 
          label="Sair" 
          onClick={onLogoutClick} 
          className="bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900 border-red-200 dark:border-red-800"
        />
      </div>
    </div>
  );
};

export default NavigationMenu;
