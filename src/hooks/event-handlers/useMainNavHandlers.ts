
import { MutableRefObject } from "react";
import { useToast } from "@/hooks/use-toast";

export const useMainNavHandlers = ({
  indexPage,
  setCnabToApiModalOpen,
  isActionAllowed,
  actionInProgressRef,
  navigationInProgressRef, // Nova referência para controlar navegação
  resetDeletionState,      // Função para resetar estado de exclusão
  signOut
}: {
  indexPage: any;
  setCnabToApiModalOpen: (open: boolean) => void;
  isActionAllowed: () => boolean;
  actionInProgressRef: MutableRefObject<boolean>;
  navigationInProgressRef: MutableRefObject<boolean>; // Novo parâmetro
  resetDeletionState?: () => void; // Função para resetar estado
  signOut: () => void;
}) => {
  const { toast } = useToast();
  
  // Helper para prevenir navegações duplicadas
  const safeNavigate = (action: () => void) => {
    // Se já estiver navegando, impedir nova ação
    if (navigationInProgressRef.current) {
      console.log("Navegação bloqueada: Operação já em andamento");
      return;
    }
    
    // Se não for permitido navegar, impedir ação
    if (!isActionAllowed()) {
      console.log("Navegação bloqueada: Operação não permitida");
      return;
    }
    
    try {
      // Marcar que uma navegação está em andamento
      navigationInProgressRef.current = true;
      
      // Resetar estado de exclusão se necessário para evitar problemas na nova tela
      if (resetDeletionState) {
        console.log("Resetando estado de exclusão antes da navegação");
        resetDeletionState();
      }
      
      // Executar a ação de navegação
      action();
      
    } finally {
      // Resetar a flag de navegação após um pequeno delay
      setTimeout(() => {
        navigationInProgressRef.current = false;
      }, 500);
    }
  };

  const handleConvenenteClick = () => {
    safeNavigate(() => {
      console.log("Navegação: Abrindo modal de convenentes");
      indexPage.setModalOpen(true);
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
    safeNavigate(async () => {
      try {
        console.log("Navegação: Iniciando logout");
        
        // Sempre resetar estado de exclusão antes de logout
        if (resetDeletionState) {
          resetDeletionState();
        }
        
        // Fechar todos os modais antes de fazer logout
        indexPage.setModalOpen(false);
        indexPage.setImportModalOpen(false);
        setCnabToApiModalOpen(false);
        indexPage.setAdminPanelOpen(false);
        
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
    });
  };

  return {
    handleConvenenteClick,
    handleImportarPlanilhaClick,
    handleCnabToApiClick,
    handleAdminPanelClick,
    handleLogoutClick
  };
};
