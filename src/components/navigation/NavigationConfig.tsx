import React from "react";
import { 
  Home, 
  Building2, 
  FileText,
  BarChart3,
  Wallet,
  Settings,
  Wrench,
  Receipt,
  ArrowUpDown,
  FileSpreadsheet,
  FileCode,
  QrCode,
  Webhook,
  Bell,
  Key,
  Users,
  Shield
} from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPix } from '@fortawesome/free-brands-svg-icons';

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
    label: "Home",
    tooltipText: "Página inicial",
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
    icon: <FileText size={24} />,
    label: "Documentação",
    tooltipText: "Documentação do sistema",
    handler: "emptyHandler",
    path: "/documentacao"
  },
  {
    icon: <BarChart3 size={24} />,
    label: "Relatórios",
    tooltipText: "Relatórios e análises",
    handler: "emptyHandler",
    path: "/relatorios"
  },
  {
    icon: <Wallet size={24} />,
    label: "Financeiro",
    tooltipText: "Gestão financeira",
    handler: "emptyHandler",
    submenu: [
      {
        icon: <ArrowUpDown size={20} />,
        label: "Pagamentos",
        tooltipText: "Gestão de pagamentos",
        handler: "emptyHandler",
        path: "/financeiro/pagamentos"
      },
      {
        icon: <Receipt size={20} />,
        label: "Recebimentos",
        tooltipText: "Gestão de recebimentos",
        handler: "emptyHandler",
        path: "/financeiro/recebimentos"
      },
      {
        icon: <FileSpreadsheet size={20} />,
        label: "Extratos e Conciliação",
        tooltipText: "Extratos e conciliação bancária",
        handler: "emptyHandler",
        path: "/financeiro/extratos"
      }
    ]
  },
  {
    icon: <FontAwesomeIcon icon={faPix} className="w-6 h-6" />,
    label: "Gestão Pix",
    tooltipText: "Gestão de PIX",
    handler: "emptyHandler",
    submenu: [
      {
        icon: <QrCode size={20} />,
        label: "Cobranças PIX",
        tooltipText: "Gestão de cobranças PIX",
        handler: "emptyHandler",
        path: "/pix/cobrancas"
      },
      {
        icon: <FileCode size={20} />,
        label: "PIX Automático",
        tooltipText: "Configuração de PIX automático",
        handler: "emptyHandler",
        path: "/pix/automatico"
      },
      {
        icon: <FileSpreadsheet size={20} />,
        label: "Extrato PIX",
        tooltipText: "Extrato de transações PIX",
        handler: "emptyHandler",
        path: "/pix/extrato"
      },
      {
        icon: <Webhook size={20} />,
        label: "Webhooks / Logs",
        tooltipText: "Webhooks e logs de PIX",
        handler: "emptyHandler",
        path: "/pix/webhooks"
      }
    ]
  },
  {
    icon: <Wrench size={24} />,
    label: "Utilitários",
    tooltipText: "Ferramentas e utilitários",
    handler: "emptyHandler",
    path: "/utilitarios"
  },
  {
    icon: <Settings size={24} />,
    label: "Configurações",
    tooltipText: "Configurações do sistema",
    handler: "emptyHandler",
    submenu: [
      {
        icon: <Key size={20} />,
        label: "APIs Cadastradas",
        tooltipText: "Gerenciar APIs cadastradas",
        handler: "emptyHandler",
        path: "/configuracoes/apis"
      },
      {
        icon: <Webhook size={20} />,
        label: "Webhooks Bancários",
        tooltipText: "Configurar webhooks bancários",
        handler: "emptyHandler",
        path: "/configuracoes/webhooks"
      },
      {
        icon: <Bell size={20} />,
        label: "Notificações e Alertas",
        tooltipText: "Configurar notificações",
        handler: "emptyHandler",
        path: "/configuracoes/notificacoes"
      },
      {
        icon: <Wallet size={20} />,
        label: "Parâmetros Financeiros",
        tooltipText: "Configurar parâmetros financeiros",
        handler: "emptyHandler",
        path: "/configuracoes/parametros"
      },
      {
        icon: <Users size={20} />,
        label: "Perfis e Permissões",
        tooltipText: "Gerenciar perfis e permissões",
        handler: "emptyHandler",
        path: "/configuracoes/perfis"
      }
    ]
  }
];
