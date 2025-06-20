
import React from "react";
import { useIndexPageContext } from "@/hooks/useIndexPageContext";
import NavigationItem from "./NavigationItem";
import { navigationItems } from "./NavigationConfig";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  
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

  // Handle navigation from item paths
  const handlePathNavigation = (path?: string) => () => {
    if (path && !actionsDisabled) {
      navigate(path);
    }
  };

  // Filter out submenu items for the main navigation display
  const mainNavigationItems = navigationItems.filter(item => !item.submenu);

  return (
    <div className="flex justify-center mb-10">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-4 max-w-6xl mx-auto">
        {mainNavigationItems.map((item, index) => {
          // Get the correct handler or use path navigation
          let clickHandler;
          if (item.path) {
            clickHandler = handleSafeClick(handlePathNavigation(item.path));
          } else {
            const handler = handlers[item.handler as keyof typeof handlers] || handlers.emptyHandler;
            clickHandler = handleSafeClick(handler);
          }
          
          return (
            <NavigationItem
              key={index}
              icon={item.icon}
              label={item.label}
              tooltipText={item.tooltipText}
              onClick={clickHandler}
              disabled={actionsDisabled}
              className={item.className}
              tooltipClassName={item.tooltipClassName}
            />
          );
        })}
      </div>
    </div>
  );
};

export default NavigationMenu;
