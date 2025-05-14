
import React from "react";
import { 
  Home, 
  Building2, 
  Users, 
  UsersRound, 
  CreditCard,
  CloudUpload, 
  RefreshCw, 
  FileText, 
  Search, 
  Settings,
} from "lucide-react";

export type NavigationItemConfig = {
  icon: React.ReactElement;
  label: string;
  tooltipText: string;
  handler: string;
  className?: string;
  tooltipClassName?: string;
  path?: string;
  submenu?: NavigationItemConfig[];
};

// Navigation configuration with all menu items
export const navigationItems: NavigationItemConfig[] = [
  {
    icon: <Home size={24} />,
    label: "Dashboard",
    tooltipText: "Painel principal do sistema",
    handler: "emptyHandler",
    path: "/"
  },
  {
    icon: <Building2 size={24} />,
    label: "Empresa",
    tooltipText: "Gerenciar informações da empresa",
    handler: "onEmpresaClick",
    path: "/empresa"
  },
  {
    icon: <Users size={24} />,
    label: "Favorecidos",
    tooltipText: "Gerenciar favorecidos para pagamentos",
    handler: "emptyHandler",
    path: "/favorecidos"
  },
  {
    icon: <UsersRound size={24} />,
    label: "Grupos",
    tooltipText: "Gerenciar grupos de pagamento",
    handler: "emptyHandler",
    path: "/grupos"
  },
  {
    icon: <CreditCard size={24} />,
    label: "Pagamentos",
    tooltipText: "Opções de pagamento",
    handler: "emptyHandler",
    submenu: [
      {
        icon: <Users size={20} />,
        label: "Para Favorecidos",
        tooltipText: "Pagamentos para favorecidos individuais",
        handler: "emptyHandler",
        path: "/pagamentos/individual"
      },
      {
        icon: <UsersRound size={20} />,
        label: "Por Grupo",
        tooltipText: "Pagamentos por grupo",
        handler: "emptyHandler",
        path: "/pagamentos/grupo"
      },
      {
        icon: <FileText size={20} />,
        label: "Importar Planilha",
        tooltipText: "Importação de planilhas para processamento",
        handler: "onImportarPlanilhaClick"
      },
      {
        icon: <CloudUpload size={20} />,
        label: "Converter CNAB",
        tooltipText: "Converter arquivo CNAB para requisição JSON para API",
        handler: "onCnabToApiClick"
      }
    ]
  },
  {
    icon: <CloudUpload size={24} />,
    label: "Remessa",
    tooltipText: "Envio de arquivos de remessa ao banco",
    handler: "emptyHandler"
  },
  {
    icon: <RefreshCw size={24} />,
    label: "Retorno",
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
    icon: <Settings size={24} />,
    label: "Configurações",
    tooltipText: "Configurações do sistema e parâmetros",
    handler: "onAdminPanelClick"
  }
];
