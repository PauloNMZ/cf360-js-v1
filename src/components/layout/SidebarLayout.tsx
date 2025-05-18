import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, Sidebar, useSidebar } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useCompanySettings } from "@/hooks/convenente/useCompanySettings";
import { AppLogo } from "@/components/ui/AppLogo";
import { useIndexPageContext } from "@/hooks/useIndexPageContext";

// Import our components
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarFooter from "./sidebar/SidebarFooter";
import SidebarNav from "./sidebar/SidebarNav";
import { useNavigationHandlers } from "./sidebar/useNavigationHandlers";
import { Button } from "@/components/ui/button";

// Custom collapse button component
const CollapseButton = () => {
  const { state, toggleSidebar } = useSidebar();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleSidebar} 
      className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-sm"
    >
      {state === "collapsed" ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      <span className="sr-only">
        {state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
      </span>
    </Button>
  );
};

const SidebarLayout = () => {
  const [cnabToApiModalOpen, setCnabToApiModalOpen] = useState(false);
  const { handlerMap, handleLogoutClick } = useNavigationHandlers(setCnabToApiModalOpen);
  const { user } = useAuth();
  const { adminPanelOpen } = useIndexPageContext();
  const { companySettings } = useCompanySettings(adminPanelOpen);
  
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-900/95">
          {/* HEADER GLOBAL */}
          <header className="bg-gradient-to-r from-[#3b82f6] to-[#1e40af] dark:from-[#0E1F46] dark:to-[#0A1C3A] text-white py-5 px-8 shadow-lg">
            <div className="flex items-center justify-between h-full px-4">
              {/* Logo e Nome da Empresa */}
              <div className="flex items-center gap-2 ml-[-8px]">
                <AppLogo 
                  size={40}
                  customLogoUrl={companySettings?.logoUrl} 
                  className="flex-shrink-0" // Garante que o logo não encolha
                />
                <span className="text-2xl font-semibold tracking-tight">
                  ConnectPag
                </span>
              </div>
              {/* Email, Avatar e Sair */}
              <div className="flex items-center gap-4">
                {user && (
                  <>
                    <span className="text-base font-medium hidden sm:block">{user.email}</span>
                    <Avatar className="h-10 w-10 border-2 border-white shadow">
                      <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center gap-2 px-4 py-2 rounded-md text-white font-semibold transition hover:bg-white/10"
                      title="Sair"
                    >
                      <LogOut className="h-5 w-5" strokeWidth={2} />
                      <span className="hidden md:inline">Sair</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </header>
          <div className="flex">
            <Sidebar 
              variant="sidebar" 
              className="sticky top-0 h-screen z-40 border-r border-border/20 bg-white/95 dark:bg-slate-950"
            >
              {/* SidebarHeader (if needed, currently empty) */}
              {/* Content area that flexes and scrolls */}
              <div className="flex flex-col flex-1 overflow-y-auto">
                <SidebarNav handlerMap={handlerMap} />
              </div>
              {/* SidebarFooter (fixed at the bottom) */}
              <SidebarFooter onLogout={handleLogoutClick} />
              <CollapseButton />
            </Sidebar>
            <div className="flex-1 overflow-auto flex flex-col">
              <div className="flex-1 overflow-auto">
                <div className="container mx-auto p-4">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default SidebarLayout;