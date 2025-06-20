
import { MutableRefObject } from "react";
import { toast } from "@/hooks/use-toast";

export const useMainNavHandlers = ({
  indexPage,
  setCnabToApiModalOpen,
  isActionAllowed,
  actionInProgressRef,
  navigationInProgressRef,
  resetDeletionState,
  signOut
}: {
  indexPage: any;
  setCnabToApiModalOpen: (open: boolean) => void;
  isActionAllowed: () => boolean;
  actionInProgressRef: MutableRefObject<boolean>;
  navigationInProgressRef: MutableRefObject<boolean>;
  resetDeletionState: () => void;
  signOut: () => void;
}) => {
  // Helper para prevenir navegações duplicadas
  const safeNavigate = (action: () => void) => {
    // Sempre resetar o estado de exclusão antes de qualquer navegação
    // Isso impede que estados travados persistam entre navegações
    try {
      console.log("Navegação: Resetando estado de exclusão proativamente");
      resetDeletionState();
    } catch (error) {
      console.error("Erro ao resetar estado durante navegação:", error);
    }
    
    // Se já estiver navegando, impedir nova ação
    if (navigationInProgressRef.current) {
      console.log("Navegação bloqueada: Operação já em andamento");
      return;
    }
    
    try {
      // Marcar que uma navegação está em andamento
      navigationInProgressRef.current = true;
      
      // Executar a ação de navegação
      action();
      
    } finally {
      // Garantir que o estado de exclusão esteja limpo após a ação
      setTimeout(() => {
        resetDeletionState();
        // Resetar a flag de navegação após um pequeno delay
        navigationInProgressRef.current = false;
      }, 300);
    }
  };

  const handleConvenenteClick = () => {
    safeNavigate(() => {
      console.log("Navegação: Abrindo modal de convenentes");
      indexPage.setModalOpen(true);
    });
  };

  const handleEmpresaClick = () => {
    safeNavigate(() => {
      console.log("Navegação: Indo para página de empresa");
      // Não precisa fazer nada aqui, o roteamento será pela path
    });
  };

  const handleImportarPlanilhaClick = () => {
    safeNavigate(() => {
      console.log("Navegação: Abrindo modal de importação");
      indexPage.setImportModalOpen(true);
    });
  };

  const handleCnabToApiClick = () => {
    safeNavigate(() => {
      console.log("Navegação: Abrindo modal CNAB para API");
      setCnabToApiModalOpen(true);
    });
  };

  const handleAdminPanelClick = () => {
    safeNavigate(() => {
      console.log("Navegação: Abrindo painel de administração");
      indexPage.setAdminPanelOpen(true);
    });
  };

  const handleLogoutClick = () => {
    // Navegação especial para logout que deve funcionar mesmo com operações pendentes
    try {
      console.log("Navegação: Iniciando logout");
      
      // Sempre resetar estado de exclusão antes de logout - com tratamento de erro
      try {
        resetDeletionState();
      } catch (e) {
        console.error("Erro ao limpar estado antes do logout:", e);
      }
      
      // Fechar todos os modais antes de fazer logout
      indexPage.setModalOpen(false);
      indexPage.setImportModalOpen(false);
      setCnabToApiModalOpen(false);
      indexPage.setAdminPanelOpen(false);
      
      // Pequeno delay antes do logout para garantir limpeza de estado
      setTimeout(async () => {
        try {
          // Executar logout
          await signOut();
        } catch (error) {
          console.error("Erro durante o logout:", error);
          toast({
            title: "Erro ao sair",
            description: "Ocorreu um problema ao tentar sair do sistema.",
            variant: "destructive",
          });
        }
      }, 100);
    } catch (error) {
      console.error("Erro no processo de logout:", error);
    }
  };

  return {
    handleConvenenteClick,
    handleEmpresaClick,
    handleImportarPlanilhaClick,
    handleCnabToApiClick,
    handleAdminPanelClick,
    handleLogoutClick
  };
};

