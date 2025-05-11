
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText, UsersRound } from "lucide-react";
import { 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { navigationItems } from "@/components/navigation/NavigationConfig";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  handlerMap: Record<string, () => void>;
}

const SidebarNav = ({ handlerMap }: SidebarNavProps) => {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarContent className="px-2">
      <SidebarGroup>
        <SidebarGroupLabel className={cn(
          "text-xs font-medium text-gray-500 dark:text-gray-400",
          isCollapsed ? "opacity-0" : "opacity-100"
        )}>
          Principal
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {/* Main navigation items */}
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton 
                      onClick={() => handlerMap[item.handler] ? handlerMap[item.handler]() : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-blue/10 hover:text-primary-blue dark:hover:bg-primary-blue/20",
                        item.className || ""
                      )}
                    >
                      {React.cloneElement(item.icon as React.ReactElement, { 
                        className: "h-5 w-5",
                        strokeWidth: 1.5 
                      })}
                      <span className={cn(
                        "flex-1 transition-opacity",
                        isCollapsed ? "opacity-0 w-0" : "opacity-100"
                      )}>
                        {item.label}
                      </span>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-gray-800 text-white">
                    <p>{item.tooltipText}</p>
                  </TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel className={cn(
          "text-xs font-medium text-gray-500 dark:text-gray-400",
          isCollapsed ? "opacity-0" : "opacity-100"
        )}>
          Pagamentos
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === "/pagamentos/individual"}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      location.pathname === "/pagamentos/individual" 
                        ? "bg-primary-blue/10 text-primary-blue dark:bg-primary-blue/20" 
                        : "hover:bg-primary-blue/10 hover:text-primary-blue dark:hover:bg-primary-blue/20"
                    )}
                  >
                    <Link to="/pagamentos/individual" className="flex items-center gap-3 w-full">
                      <FileText className="h-5 w-5" strokeWidth={1.5} />
                      <span className={cn(
                        "flex-1 transition-opacity",
                        isCollapsed ? "opacity-0 w-0" : "opacity-100"
                      )}>
                        Individual
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-800 text-white">
                  <p>Pagamentos Individuais</p>
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === "/pagamentos/grupo"}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      location.pathname === "/pagamentos/grupo" 
                        ? "bg-primary-blue/10 text-primary-blue dark:bg-primary-blue/20" 
                        : "hover:bg-primary-blue/10 hover:text-primary-blue dark:hover:bg-primary-blue/20"
                    )}
                  >
                    <Link to="/pagamentos/grupo" className="flex items-center gap-3 w-full">
                      <UsersRound className="h-5 w-5" strokeWidth={1.5} />
                      <span className={cn(
                        "flex-1 transition-opacity",
                        isCollapsed ? "opacity-0 w-0" : "opacity-100"
                      )}>
                        Por Grupo
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-800 text-white">
                  <p>Pagamentos por Grupo</p>
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === "/grupos"}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      location.pathname === "/grupos" 
                        ? "bg-primary-blue/10 text-primary-blue dark:bg-primary-blue/20" 
                        : "hover:bg-primary-blue/10 hover:text-primary-blue dark:hover:bg-primary-blue/20"
                    )}
                  >
                    <Link to="/grupos" className="flex items-center gap-3 w-full">
                      <UsersRound className="h-5 w-5" strokeWidth={1.5} />
                      <span className={cn(
                        "flex-1 transition-opacity",
                        isCollapsed ? "opacity-0 w-0" : "opacity-100"
                      )}>
                        Gerenciar Grupos
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-800 text-white">
                  <p>Gerenciar Grupos de Pagamento</p>
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default SidebarNav;
