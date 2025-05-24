
import React from "react";
import MenuSection from "./MenuSection";

interface AdminMenuProps {
  onBankConnectionsClick: () => void;
  onCompanySettingsClick: () => void;
  onAPIManagementClick: () => void;
}

const AdminMenu: React.FC<AdminMenuProps> = ({
  onBankConnectionsClick,
  onCompanySettingsClick,
  onAPIManagementClick,
}) => {
  return (
    <>
      <MenuSection
        title="Gestão de Usuários"
        description="Gerencie usuários e permissões do sistema"
        primaryAction={{ label: "Perfis e Permissões", onClick: () => {} }}
        secondaryAction={{ label: "Listar Usuários", onClick: () => {} }}
      />

      <MenuSection
        title="Configurações do Sistema"
        description="Ajuste configurações globais e parâmetros operacionais"
        primaryAction={{ label: "Configurações da Empresa", onClick: onCompanySettingsClick }}
        secondaryAction={{ label: "Parâmetros Financeiros", onClick: () => {} }}
      />

      <MenuSection
        title="Integrações Bancárias"
        description="Configure APIs e conexões com instituições financeiras"
        primaryAction={{ label: "Gerenciar APIs", onClick: onAPIManagementClick }}
        secondaryAction={{ label: "Conexões Bancárias", onClick: onBankConnectionsClick }}
      />

      <MenuSection
        title="Notificações"
        description="Configure alertas e notificações do sistema"
        primaryAction={{ label: "Configurar Notificações", onClick: () => {} }}
        secondaryAction={{ label: "Templates de Mensagem", onClick: () => {} }}
      />

      <MenuSection
        title="Auditoria"
        description="Visualize logs e histórico de operações"
        primaryAction={{ label: "Logs do Sistema", onClick: () => {} }}
        secondaryAction={{ label: "Relatórios de Auditoria", onClick: () => {} }}
      />
    </>
  );
};

export default AdminMenu;
