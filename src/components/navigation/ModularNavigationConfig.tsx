
import React from "react";
import { 
  Home, 
  Building2, 
  FileText, 
  BarChart2, 
  DollarSign, 
  Settings,
  CreditCard,
  Users,
  Upload,
  Receipt,
  Zap,
  Webhook,
  Bell,
  Shield,
  Key,
  Banknote
} from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPix } from '@fortawesome/free-brands-svg-icons';
import { SidebarModule } from "@/types/sidebar";

export const modularNavigationConfig: SidebarModule[] = [
  {
    name: "Home",
    icon: "Home",
    path: "/"
  },
  {
    name: "Minhas Empresas",
    icon: "Building2",
    path: "/empresa"
  },
  {
    name: "Documentação",
    icon: "FileText",
    path: "/documentacao"
  },
  {
    name: "Relatórios",
    icon: "BarChart2",
    path: "/relatorios"
  },
  {
    name: "Financeiro",
    icon: "DollarSign",
    children: [
      {
        name: "Transferências",
        link: "/financeiro/transferencias"
      },
      {
        name: "Extratos",
        link: "/financeiro/extratos"
      },
      {
        name: "Conciliação",
        link: "/financeiro/conciliacao"
      }
    ]
  },
  {
    name: "Pagamentos",
    icon: "CreditCard",
    children: [
      {
        name: "Transferências",
        link: "/pagamentos/transferencias"
      },
      {
        name: "Por Favoritos",
        link: "/pagamentos/favoritos"
      },
      {
        name: "Por Grupos",
        link: "/pagamentos/grupos"
      },
      {
        name: "Lançamentos",
        link: "/pagamentos/lancamentos"
      },
      {
        name: "Por Favorecidos",
        link: "/favorecidos"
      },
      {
        name: "Por Grupos",
        link: "/grupos"
      },
      {
        name: "Importar Planilha",
        link: "/pagamentos/importar-planilha"
      },
      {
        name: "Importar CNAB",
        link: "/pagamentos/importar-cnab"
      },
      {
        name: "Títulos",
        link: "/pagamentos/titulos"
      },
      {
        name: "Guias",
        link: "/pagamentos/guias"
      }
    ]
  },
  {
    name: "Gestão de PIX",
    icon: "FaPix",
    children: [
      {
        name: "Cobranças PIX",
        link: "/pix/cobrancas"
      },
      {
        name: "PIX Automático",
        link: "/pix/automatico"
      },
      {
        name: "Extrato PIX",
        link: "/pix/extrato"
      },
      {
        name: "Webhooks / Logs",
        link: "/pix/webhooks"
      }
    ]
  },
  {
    name: "Utilitários",
    icon: "Settings",
    children: [
      {
        name: "Validador de CPF/CNPJ",
        link: "/utilitarios/validador"
      },
      {
        name: "Gerador de Códigos",
        link: "/utilitarios/gerador"
      },
      {
        name: "Calculadora Financeira",
        link: "/utilitarios/calculadora"
      }
    ]
  },
  {
    name: "Configurações",
    icon: "Settings",
    children: [
      {
        name: "APIs Cadastradas",
        link: "/configuracoes/apis"
      },
      {
        name: "Webhooks Bancários",
        link: "/configuracoes/webhooks"
      },
      {
        name: "Notificações e Alertas",
        link: "/configuracoes/notificacoes"
      },
      {
        name: "Parâmetros Financeiros",
        link: "/configuracoes/parametros"
      },
      {
        name: "Perfis e Permissões",
        link: "/configuracoes/perfis"
      },
      {
        name: "LGPD & Privacidade",
        link: "/configuracoes/lgpd"
      }
    ]
  }
];

// Helper function to get icon component by name
export const getIconComponent = (iconName: string, size: number = 20) => {
  const iconMap: Record<string, React.ReactElement> = {
    Home: <Home size={size} />,
    Building2: <Building2 size={size} />,
    FileText: <FileText size={size} />,
    BarChart2: <BarChart2 size={size} />,
    DollarSign: <DollarSign size={size} />,
    Settings: <Settings size={size} />,
    CreditCard: <CreditCard size={size} />,
    Users: <Users size={size} />,
    Upload: <Upload size={size} />,
    Receipt: <Receipt size={size} />,
    Zap: <Zap size={size} />,
    Webhook: <Webhook size={size} />,
    Bell: <Bell size={size} />,
    Shield: <Shield size={size} />,
    Key: <Key size={size} />,
    Banknote: <Banknote size={size} />,
    FaPix: <FontAwesomeIcon icon={faPix} style={{ width: size, height: size }} />
  };

  return iconMap[iconName] || <Settings size={size} />;
};
