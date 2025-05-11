
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from "@/components/ui/sidebar";
import { navigationItems } from "@/components/navigation/NavigationConfig";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SidebarNavProps {
  handlerMap: Record<string, () => void>;
}

const SidebarNav = ({ handlerMap }: SidebarNavProps) => {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(prev => prev === label ? null : label);
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  return (
    <SidebarContent className="px-2">
      <SidebarGroup>
        <SidebarGroupLabel className={cn(
          "text-xs font-medium text-gray-500 dark:text-gray-400",
          isCollapsed ? "opacity-0" : "opacity-100"
        )}>
          Navegação
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {/* Main navigation items */}
            {navigationItems.map((item) => (
              item.submenu ? (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuSub>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuSubButton 
                          onClick={() => toggleSubmenu(item.label)}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            openSubmenu === item.label ? 
                              "bg-primary-blue/10 text-primary-blue dark:bg-primary-blue/20" : 
                              "hover:bg-primary-blue/10 hover:text-primary-blue dark:hover:bg-primary-blue/20",
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
                        </SidebarMenuSubButton>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-gray-800 text-white">
                        <p>{item.tooltipText}</p>
                      </TooltipContent>
                    </Tooltip>
                    <SidebarMenuSubItem className={cn(
                      isCollapsed ? "pl-0" : "pl-4",
                      openSubmenu === item.label ? "block" : "hidden"
                    )}>
                      {item.submenu.map(subItem => (
                        <SidebarMenuItem key={subItem.label}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {subItem.path ? (
                                <SidebarMenuButton 
                                  asChild
                                  isActive={isActive(subItem.path)}
                                  className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive(subItem.path) ? 
                                      "bg-primary-blue/10 text-primary-blue dark:bg-primary-blue/20" : 
                                      "hover:bg-primary-blue/10 hover:text-primary-blue dark:hover:bg-primary-blue/20"
                                  )}
                                >
                                  <Link to={subItem.path} className="flex items-center gap-3 w-full">
                                    {React.cloneElement(subItem.icon as React.ReactElement, { 
                                      className: "h-4 w-4",
                                      strokeWidth: 1.5 
                                    })}
                                    <span className={cn(
                                      "flex-1 transition-opacity",
                                      isCollapsed ? "opacity-0 w-0" : "opacity-100"
                                    )}>
                                      {subItem.label}
                                    </span>
                                  </Link>
                                </SidebarMenuButton>
                              ) : (
                                <SidebarMenuButton 
                                  onClick={() => handlerMap[subItem.handler] ? handlerMap[subItem.handler]() : undefined}
                                  className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    "hover:bg-primary-blue/10 hover:text-primary-blue dark:hover:bg-primary-blue/20"
                                  )}
                                >
                                  {React.cloneElement(subItem.icon as React.ReactElement, { 
                                    className: "h-4 w-4",
                                    strokeWidth: 1.5 
                                  })}
                                  <span className={cn(
                                    "flex-1 transition-opacity",
                                    isCollapsed ? "opacity-0 w-0" : "opacity-100"
                                  )}>
                                    {subItem.label}
                                  </span>
                                </SidebarMenuButton>
                              )}
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-gray-800 text-white">
                              <p>{subItem.tooltipText}</p>
                            </TooltipContent>
                          </Tooltip>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              ) : (
                <SidebarMenuItem key={item.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {item.path ? (
                        <SidebarMenuButton 
                          asChild
                          isActive={isActive(item.path)}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            isActive(item.path) ? 
                              "bg-primary-blue/10 text-primary-blue dark:bg-primary-blue/20" : 
                              "hover:bg-primary-blue/10 hover:text-primary-blue dark:hover:bg-primary-blue/20",
                            item.className || ""
                          )}
                        >
                          <Link to={item.path} className="flex items-center gap-3 w-full">
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
                          </Link>
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton 
                          onClick={() => handlerMap[item.handler] ? handlerMap[item.handler]() : undefined}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            "hover:bg-primary-blue/10 hover:text-primary-blue dark:hover:bg-primary-blue/20",
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
                      )}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-gray-800 text-white">
                      <p>{item.tooltipText}</p>
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              )
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default SidebarNav;
