
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme} 
          className="rounded-md text-gray-500 hover:text-primary-blue hover:bg-primary-blue/10"
        >
          {theme === "dark" ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Alternar tema</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side={isSidebarAvailable && isCollapsed ? "right" : "bottom"} className="bg-gray-800 text-white">
        <p>{theme === "dark" ? "Modo claro" : "Modo escuro"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
