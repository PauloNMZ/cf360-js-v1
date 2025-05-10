
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

// Import our components
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarFooter from "./sidebar/SidebarFooter";
import SidebarNav from "./sidebar/SidebarNav";
import { useNavigationHandlers } from "./sidebar/useNavigationHandlers";

const SidebarLayout = () => {
  const [cnabToApiModalOpen, setCnabToApiModalOpen] = useState(false);
  const { handlerMap, handleLogoutClick } = useNavigationHandlers(setCnabToApiModalOpen);
  const { user } = useAuth();

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <Sidebar>
            <SidebarHeader />
            <SidebarNav handlerMap={handlerMap} />
            <SidebarFooter onLogout={handleLogoutClick} />
          </Sidebar>
          <div className="flex-1 overflow-auto flex flex-col">
            {/* Title Bar */}
            <header className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950 text-white py-3 px-6 shadow-md">
              <div className="w-full mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Connect Pag</h1>
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
            <div className="flex-1 overflow-auto">
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
