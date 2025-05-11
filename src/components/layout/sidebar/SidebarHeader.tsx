
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
    <Header className="border-b border-border/50 py-2">
      <div className="flex items-center px-2">
        <div className={cn(
          "flex items-center transition-all duration-200",
          isCollapsed ? "justify-center w-full" : "justify-start"
        )}>
          <AppLogo 
            size={isCollapsed ? 32 : 28} 
            customLogoUrl={companySettings.logoUrl} 
          />
          {!isCollapsed && (
            <div className="ml-2 transition-opacity duration-200">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                ConnectPag
              </h2>
            </div>
          )}
        </div>
      </div>
    </Header>
  );
};

export default SidebarHeader;
