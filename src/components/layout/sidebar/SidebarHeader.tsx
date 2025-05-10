
import React from "react";
import { SidebarHeader as Header } from "@/components/ui/sidebar";

const SidebarHeader = () => {
  return (
    <Header className="border-b border-border/50">
      <div className="flex h-12 items-center px-6">
        <span className="font-semibold">Menu Principal</span>
      </div>
    </Header>
  );
};

export default SidebarHeader;
