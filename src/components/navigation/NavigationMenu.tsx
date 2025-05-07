
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIndexPageContext } from "@/hooks/useIndexPageContext";
import NavigationItem from "./NavigationItem";
import { navigationItems } from "./NavigationConfig";

type NavigationMenuProps = {
  onConvenenteClick: () => void;
  onImportarPlanilhaClick: () => void;
  onCnabToApiClick: () => void;
  onAdminPanelClick: () => void;
  onLogoutClick: () => void;
};

const NavigationMenu = ({
  onConvenenteClick,
  onImportarPlanilhaClick,
  onCnabToApiClick,
  onAdminPanelClick,
  onLogoutClick
}: NavigationMenuProps) => {
  const { isDeleting, isLoading } = useIndexPageContext();
  
  // Determine if actions are allowed
  const actionsDisabled = isDeleting || isLoading;
  
  // Create safe handler wrappers that handle click events internally
  // and return a function with no parameters to match the expected signature
  const handleSafeClick = (handler: () => void) => () => {
    // Safety check for state
    if (actionsDisabled) {
      console.log("Navigation action blocked: Operation in progress");
      return;
    }
    
    console.log("Executing navigation handler");
    try {
      handler();
    } catch (e) {
      console.error("Erro ao executar handler de navegação:", e);
    }
  };

  // Map handler names to actual handler functions
  const handlers = {
    onConvenenteClick,
    onImportarPlanilhaClick,
    onCnabToApiClick,
    onAdminPanelClick,
    onLogoutClick,
    emptyHandler: () => {}
  };

  return (
    <TooltipProvider>
      <div className="flex justify-center mb-10">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-4 max-w-6xl mx-auto">
          {navigationItems.map((item, index) => {
            // Obter o handler correto ou usar o handler vazio
            const handler = handlers[item.handler as keyof typeof handlers] || handlers.emptyHandler;
            
            return (
              <NavigationItem
                key={index}
                icon={item.icon}
                label={item.label}
                tooltipText={item.tooltipText}
                onClick={handleSafeClick(handler)}
                disabled={actionsDisabled}
                className={item.className}
                tooltipClassName={item.tooltipClassName}
              />
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default NavigationMenu;
