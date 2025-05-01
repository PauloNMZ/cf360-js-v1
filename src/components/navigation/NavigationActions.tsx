
import React from "react";
import { useAuth } from "@/hooks/use-auth";

type NavigationActionsProps = {
  onConvenenteClick: () => void;
  onImportarPlanilhaClick: () => void;
  onAdminPanelClick: () => void;
};

const NavigationActions = ({ 
  onConvenenteClick, 
  onImportarPlanilhaClick, 
  onAdminPanelClick 
}: NavigationActionsProps) => {
  const { signOut } = useAuth();

  const handleLogoutClick = async () => {
    await signOut();
  };

  return {
    handleConvenenteClick: onConvenenteClick,
    handleImportarPlanilhaClick: onImportarPlanilhaClick,
    handleAdminPanelClick: onAdminPanelClick,
    handleLogoutClick
  };
};

export default NavigationActions;
