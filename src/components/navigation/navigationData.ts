
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
      },
      {
        name: "Pagamentos",
        link: "/financeiro/pagamentos"
      },
      {
        name: "Recebimentos",
        link: "/financeiro/recebimentos"
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
    name: "Gestão de Pix",
    icon: "PIX_ICON",
    children: [
      {
        name: "Cobranças Pix",
        link: "/pix/cobrancas"
      },
      {
        name: "Pix Automático",
        link: "/pix/automatico"
      },
      {
        name: "Extrato Pix",
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
