
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "@/components/ui/sidebar";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  let isCollapsed = false;
  let isSidebarAvailable = true;
  
  try {
    // Try to use the sidebar hook, but don't fail if it's not available
    const { state } = useSidebar();
    isCollapsed = state === "collapsed";
  } catch (error) {
    // If we're outside of a SidebarProvider, we won't have access to the sidebar state
    isSidebarAvailable = false;
  }
  
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };
  
  const isDark = theme === "dark";
  
  // Use in standalone mode (like in auth page)
  if (typeof window !== 'undefined' && window.location.pathname === '/auth') {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleTheme} 
        className="rounded-full bg-gray-100 dark:bg-slate-800 h-10 w-10"
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-yellow-500" strokeWidth={1.5} />
        ) : (
          <Moon className="h-5 w-5 text-gray-700" strokeWidth={1.5} />
        )}
        <span className="sr-only">Alternar tema</span>
      </Button>
    );
  }
  
  // Full featured mode with tooltip if necessary
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggleTheme}
            className="group relative flex w-full items-center gap-4 rounded-lg px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-all duration-300"
          >
            <div className="transition-transform duration-300 group-hover:translate-x-2">
              {isDark ? (
                <Sun className="h-7 w-7 text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
              ) : (
                <Moon className="h-7 w-7 text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
              )}
            </div>
            {!isCollapsed && (
              <span>{isDark ? 'Modo Claro' : 'Modo Escuro'}</span>
            )}
          </button>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" className="bg-gray-800 text-white">
            <p>{isDark ? "Modo Claro" : "Modo Escuro"}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
