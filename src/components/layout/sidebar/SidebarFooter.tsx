
import React from "react";
import { LogOut } from "lucide-react";
import { SidebarFooter as Footer } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarFooterProps {
  onLogout: () => void;
}

const SidebarFooter = ({ onLogout }: SidebarFooterProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Footer className="border-t p-3 border-border/50">
      <div className={cn(
        "flex items-center transition-all duration-200",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        <ThemeToggle />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={onLogout}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors",
                isCollapsed ? "w-8 h-8 justify-center p-0" : ""
              )}
            >
              <LogOut size={16} />
              {!isCollapsed && <span>Sair</span>}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-800 text-white">
            <p>Sair do sistema</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </Footer>
  );
};

export default SidebarFooter;
