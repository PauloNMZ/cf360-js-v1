import React from "react";
import { LogOut } from "lucide-react";
import { SidebarFooter as Footer } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon } from "lucide-react";

interface SidebarFooterProps {
  onLogout: () => void;
}

const SidebarFooter = ({ onLogout }: SidebarFooterProps) => {
  const { state } = useSidebar();
  const { theme, setTheme } = useTheme();
  const isCollapsed = state === "collapsed";
  const isDark = theme === "dark";

  return (
    <Footer className="border-t border-border/20 px-4 pt-2 pb-8 mt-auto">
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="group relative flex w-full items-center gap-4 rounded-lg px-4 py-3 text-base font-medium text-foreground hover:bg-gray-100 dark:hover:bg-slate-800/70"
        >
          <div className="transition-transform duration-300 group-hover:translate-x-2">
            {isDark ? (
              <Sun className="h-7 w-7 text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
            ) : (
              <Moon className="h-7 w-7 text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
            )}
          </div>
          {!isCollapsed && <span>{isDark ? 'Modo Claro' : 'Modo Escuro'}</span>}
        </button>
        
        <button
          onClick={onLogout}
          className="group relative flex w-full items-center gap-4 rounded-lg px-4 py-3 text-base font-medium text-foreground hover:bg-gray-100 dark:hover:bg-slate-800/70"
        >
          <div className="transition-transform duration-300 group-hover:translate-x-2">
            <LogOut className="h-7 w-7 text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
          </div>
          {!isCollapsed && <span>Sair</span>}
        </button>
      </div>
    </Footer>
  );
};

export default SidebarFooter;
