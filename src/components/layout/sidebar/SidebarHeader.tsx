
import React from "react";
import { SidebarHeader as Header } from "@/components/ui/sidebar";
import { AppLogo } from "@/components/ui/AppLogo";
import { getCompanySettings } from "@/services/companySettings";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const SidebarHeader = () => {
  const companySettings = getCompanySettings();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Header className="py-4">
      <div className="flex items-center px-4">
        <div className={cn(
          "flex items-center gap-3 transition-all duration-200",
          isCollapsed ? "justify-center w-full" : "justify-start"
        )}>
          <AppLogo 
            size={isCollapsed ? 32 : 36} 
            customLogoUrl={companySettings.logoUrl} 
            className="flex-shrink-0" 
          />
          {!isCollapsed && (
            <div className="flex flex-col transition-opacity duration-200">
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary-blue to-primary-magenta bg-clip-text text-transparent">
                Cash Flow 360
              </h2>
              <span className="text-xs text-muted-foreground">Sistema de Pagamentos</span>
            </div>
          )}
        </div>
      </div>
    </Header>
  );
};

export default SidebarHeader;
