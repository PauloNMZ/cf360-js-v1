
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, Sidebar, useSidebar } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
      {state === "collapsed" ? (
        <ChevronRight className="h-4 w-4" />
      ) : (
        <ChevronLeft className="h-4 w-4" />
      )}
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

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <Sidebar variant="floating" className="z-30 border-r border-border/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <SidebarHeader />
            <SidebarNav handlerMap={handlerMap} />
            <SidebarFooter onLogout={handleLogoutClick} />
            <CollapseButton />
          </Sidebar>
          <div className="flex-1 overflow-auto flex flex-col">
            {/* Title Bar with gradient using new colors */}
            <header className="bg-gradient-to-r from-primary-blue to-primary-magenta dark:from-primary-blue/80 dark:to-primary-magenta/80 text-white py-3 px-6 shadow-md">
              <div className="w-full mx-auto flex justify-between items-center">
                <div className="ml-4">
                  <h1 className="text-2xl font-bold">Connect Pag</h1>
                </div>
                <div className="flex items-center gap-4">
                  {user && (
                    <>
                      <p className="text-sm hidden sm:block">{user.email}</p>
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </>
                  )}
                </div>
              </div>
            </header>
            
            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
              <div className="container mx-auto p-4">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default SidebarLayout;
