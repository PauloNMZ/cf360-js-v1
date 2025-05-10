
import React from "react";
import { SidebarHeader as Header } from "@/components/ui/sidebar";
import { AppLogo } from "@/components/ui/AppLogo";
import { getCompanySettings } from "@/services/companySettings";

const SidebarHeader = () => {
  const companySettings = getCompanySettings();
  
  return (
    <Header className="border-b border-border/50">
      <div className="flex h-12 items-center justify-center px-6">
        <AppLogo size={32} customLogoUrl={companySettings.logoUrl} />
      </div>
    </Header>
  );
};

export default SidebarHeader;
