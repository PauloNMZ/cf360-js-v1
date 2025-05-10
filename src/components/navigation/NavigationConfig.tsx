
import React from "react";
import { 
  Home, 
  CloudUpload, 
  Send, 
  RefreshCw, 
  FileText, 
  Search, 
  Shield,
  FileSpreadsheet,
} from "lucide-react";

export type NavigationItemConfig = {
  icon: React.ReactNode;
  label: string;
  tooltipText: string;
  handler: string;
  className?: string;
  tooltipClassName?: string;
};

// Navigation configuration with all menu items (removed the LogOut item)
export const navigationItems: NavigationItemConfig[] = [
  {
    icon: <FileSpreadsheet size={24} />,
    label: "Planilha",
    tooltipText: "Importação de planilhas para processamento",
    handler: "onImportarPlanilhaClick"
  },
  {
    icon: <Send size={24} />,
    label: "CNAB2API",
    tooltipText: "Converter arquivo CNAB para requisição JSON para API",
    handler: "onCnabToApiClick"
  },
  {
    icon: <CloudUpload size={24} />,
    label: "Remessa",
    tooltipText: "Envio de arquivos de remessa ao banco",
    handler: "emptyHandler"
  },
  {
    icon: <RefreshCw size={24} />,
    label: "Retornos",
    tooltipText: "Processamento de arquivos de retorno bancário",
    handler: "emptyHandler"
  },
  {
    icon: <FileText size={24} />,
    label: "Comprovantes",
    tooltipText: "Visualização e download de comprovantes",
    handler: "emptyHandler"
  },
  {
    icon: <Search size={24} />,
    label: "Consultas",
    tooltipText: "Consulta de registros e operações",
    handler: "emptyHandler"
  },
  {
    icon: <Shield size={24} />,
    label: "Setup",
    tooltipText: "Configurações do sistema e parâmetros",
    handler: "onAdminPanelClick"
  }
];
