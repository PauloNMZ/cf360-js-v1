
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

// Import our newly created components
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarFooter from "./sidebar/SidebarFooter";
import SidebarNav from "./sidebar/SidebarNav";
import { useNavigationHandlers } from "./sidebar/useNavigationHandlers";

const SidebarLayout = () => {
  const [cnabToApiModalOpen, setCnabToApiModalOpen] = useState(false);
  const { handlerMap, handleLogoutClick } = useNavigationHandlers(setCnabToApiModalOpen);

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <Sidebar>
            <SidebarHeader />
            <SidebarNav handlerMap={handlerMap} />
            <SidebarFooter onLogout={handleLogoutClick} />
          </Sidebar>
          <div className="flex-1 overflow-auto">
            <div className="container mx-auto p-4">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default SidebarLayout;
