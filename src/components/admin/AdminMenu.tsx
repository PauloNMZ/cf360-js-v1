
import React from "react";
import MenuSection from "./MenuSection";

interface AdminMenuProps {
  onBankConnectionsClick: () => void;
  onCompanySettingsClick: () => void;
}

const AdminMenu: React.FC<AdminMenuProps> = ({
  onBankConnectionsClick,
  onCompanySettingsClick,
}) => {
  return (
    <>
      <MenuSection
        title="Gestão de Usuários"
        description="Gerencie usuários e permissões do sistema"
        primaryAction={{ label: "Adicionar Usuário", onClick: () => {} }}
        secondaryAction={{ label: "Listar Usuários", onClick: () => {} }}
      />

      <MenuSection
        title="Configurações do Sistema"
        description="Ajuste configurações globais e parâmetros operacionais"
        primaryAction={{ label: "Configurações da Empresa", onClick: onCompanySettingsClick }}
        secondaryAction={{ label: "Conexões Bancárias", onClick: onBankConnectionsClick }}
      />

      <MenuSection
        title="Auditoria"
        description="Visualize logs e histórico de operações"
        primaryAction={{ label: "Logs do Sistema", onClick: () => {} }}
        secondaryAction={{ label: "Histórico de Transações", onClick: () => {} }}
      />
    </>
  );
};

export default AdminMenu;
