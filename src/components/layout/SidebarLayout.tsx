
import React, { useState } from "react";
import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";

// Import our newly created components
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarFooter from "./sidebar/SidebarFooter";
import SidebarNav from "./sidebar/SidebarNav";
import { useNavigationHandlers } from "./sidebar/useNavigationHandlers";

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const [cnabToApiModalOpen, setCnabToApiModalOpen] = useState(false);
  const { handlerMap, handleLogoutClick } = useNavigationHandlers(setCnabToApiModalOpen);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader />
          <SidebarNav handlerMap={handlerMap} />
          <SidebarFooter onLogout={handleLogoutClick} />
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
