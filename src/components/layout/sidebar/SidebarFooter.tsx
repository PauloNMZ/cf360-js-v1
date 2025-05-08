
import React from "react";
import { LogOut } from "lucide-react";
import { SidebarFooter as Footer } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface SidebarFooterProps {
  onLogout: () => void;
}

const SidebarFooter = ({ onLogout }: SidebarFooterProps) => {
  return (
    <Footer className="border-t p-4 border-border/50">
      <div className="flex justify-between items-center">
        <ThemeToggle />
        <div className="flex items-center gap-2">
          <button 
            onClick={onLogout}
            className="text-red-500 hover:text-red-600 flex items-center gap-2"
          >
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </Footer>
  );
};

export default SidebarFooter;
