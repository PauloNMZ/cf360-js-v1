
import React, { useState, useRef } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { navigationItems } from "@/components/navigation/NavigationConfig";
import NavigationItem from "@/components/navigation/NavigationItem";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMainNavHandlers } from "@/hooks/event-handlers/useMainNavHandlers";
import { useIndexPageContext } from "@/hooks/useIndexPageContext";
import { useIndexPageActions } from "@/hooks/useIndexPageActions";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider, 
  SidebarRail, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { 
  Home, 
  FileText, 
  FileSpreadsheet, 
  UsersRound,
  CreditCard,
  LogOut 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const { signOut } = useAuth();
  const isMobile = useIsMobile();
  const [cnabToApiModalOpen, setCnabToApiModalOpen] = useState(false);
  const indexPage = useIndexPageContext();
  const indexPageActions = useIndexPageActions({
    setFormMode: indexPage.setFormMode,
    setFormData: indexPage.setFormData,
    setFormValid: indexPage.setFormValid,
    setConvenentes: indexPage.setConvenentes,
    currentConvenenteId: indexPage.currentConvenenteId,
    setCurrentConvenenteId: indexPage.setCurrentConvenenteId,
    setIsLoading: indexPage.setIsLoading
  });
  
  // References to prevent duplicated or conflicting actions
  const actionInProgressRef = useRef(false);
  const navigationInProgressRef = useRef(false);
  
  // Reset deletion state to avoid persistent errors
  const resetDeletionState = () => {
    if (indexPageActions.resetDeletionState) {
      indexPageActions.resetDeletionState();
    }
    indexPage.setShowDeleteDialog(false);
  };
  
  // Helper to check if an action should be allowed
  const isActionAllowed = () => {
    if (actionInProgressRef.current) {
      console.log("Ação bloqueada: Operação já em andamento");
      return false;
    }
    return true;
  };
  
  // Navigation handlers
  const navHandlers = useMainNavHandlers({
    indexPage,
    setCnabToApiModalOpen,
    isActionAllowed,
    actionInProgressRef,
    navigationInProgressRef,
    resetDeletionState,
    signOut
  });
  
  const location = useLocation();
  
  // Map navigation handler names to actual handler functions
  const handlerMap: Record<string, () => void> = {
    onConvenenteClick: navHandlers.handleConvenenteClick,
    onImportarPlanilhaClick: navHandlers.handleImportarPlanilhaClick,
    onCnabToApiClick: navHandlers.handleCnabToApiClick,
    onAdminPanelClick: navHandlers.handleAdminPanelClick,
    onLogoutClick: navHandlers.handleLogoutClick,
    emptyHandler: () => console.log("Esta funcionalidade ainda não foi implementada")
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-border/50">
            <div className="flex h-12 items-center px-6">
              <span className="font-semibold">CNAB Manager</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* Main navigation items */}
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton 
                        onClick={() => handlerMap[item.handler] ? handlerMap[item.handler]() : undefined}
                        className={item.className || ""}
                        tooltip={item.tooltipText}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Pagamentos</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/pagamentos/individual"}>
                      <Link to="/pagamentos/individual">
                        <FileText />
                        <span>Individual</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/pagamentos/grupo"}>
                      <Link to="/pagamentos/grupo">
                        <UsersRound />
                        <span>Por Grupo</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/pagamentos/multi-grupo"}>
                      <Link to="/pagamentos/multi-grupo">
                        <FileSpreadsheet />
                        <span>Multi-grupos</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Gestão</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/grupos"}>
                      <Link to="/grupos">
                        <UsersRound />
                        <span>Gerenciar Grupos</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4 border-border/50">
            <div className="flex justify-between items-center">
              <ThemeToggle />
              <div className="flex items-center gap-2">
                <button 
                  onClick={navHandlers.handleLogoutClick}
                  className="text-red-500 hover:text-red-600 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SidebarLayout;
