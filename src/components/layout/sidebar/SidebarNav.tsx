
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  useSidebar
} from "@/components/ui/sidebar";
import { navigationItems } from "@/components/navigation/NavigationConfig";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

interface SidebarNavProps {
  handlerMap: Record<string, () => void>;
}

const SidebarNav = ({ handlerMap }: SidebarNavProps) => {
  const location = useLocation();
  const { state } = useSidebar();
  const { theme } = useTheme();
  const isDark = theme === "dark";
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
    <SidebarContent className="pt-5">
      <SidebarGroup>
        <SidebarGroupContent>
          <nav className="flex-1 space-y-1 px-4">
            {navigationItems.map((item) => (
              item.submenu ? (
                <div key={item.label} className="relative">
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={cn(
                      "group relative flex w-full items-center gap-4 rounded-lg px-4 py-3 text-base font-medium transition-all duration-300",
                      openSubmenu === item.label
                        ? "bg-primary-blue/10 dark:bg-primary-blue/20 text-primary-blue dark:text-primary-magenta"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/50"
                    )}
                  >
                    {/* Active indicator bar */}
                    <div
                      className={cn(
                        "absolute left-0 top-0 h-full w-1 rounded-l-lg bg-primary-blue dark:bg-primary-magenta transition-transform duration-300",
                        openSubmenu === item.label ? "transform scale-y-100" : "transform scale-y-0"
                      )}
                    />
                    
                    {/* Icon with transition */}
                    <div
                      className={cn(
                        "transition-transform duration-300",
                        openSubmenu === item.label 
                          ? "transform translate-x-1" 
                          : "transform translate-x-0 group-hover:translate-x-1"
                      )}
                    >
                      {React.cloneElement(item.icon as React.ReactElement, {
                        className: cn(
                          "h-7 w-7 flex-shrink-0 transition-colors duration-300",
                          openSubmenu === item.label
                            ? isDark ? "text-primary-magenta" : "text-primary-blue"
                            : "text-gray-500 dark:text-gray-400"
                        ),
                        strokeWidth: 1.5,
                      })}
                    </div>
                    
                    {/* Label with transition */}
                    {!isCollapsed && (
                      <span
                        className={cn(
                          "flex-1 transition-all duration-300",
                          openSubmenu === item.label 
                            ? "transform translate-x-1" 
                            : "transform translate-x-0"
                        )}
                      >
                        {item.label}
                      </span>
                    )}
                    
                    {/* Dropdown icon */}
                    {!isCollapsed && (
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 transition-transform duration-300",
                          openSubmenu === item.label ? "rotate-180" : ""
                        )}
                      />
                    )}
                  </button>
                  
                  {/* Submenu items */}
                  {openSubmenu === item.label && !isCollapsed && (
                    <div className="ml-7 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <div key={subItem.label}>
                          {subItem.path ? (
                            <Link
                              to={subItem.path}
                              className={cn(
                                "group flex items-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-200",
                                isActive(subItem.path)
                                  ? "bg-primary-blue/10 dark:bg-primary-blue/20 text-primary-blue dark:text-primary-magenta"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/50"
                              )}
                            >
                              {React.cloneElement(subItem.icon as React.ReactElement, {
                                className: cn(
                                  "mr-3 h-5 w-5",
                                  isActive(subItem.path)
                                    ? isDark ? "text-primary-magenta" : "text-primary-blue"
                                    : "text-gray-500 dark:text-gray-400"
                                ),
                                strokeWidth: 1.5,
                              })}
                              <span>{subItem.label}</span>
                            </Link>
                          ) : (
                            <button
                              onClick={handlerMap[subItem.handler] ? handlerMap[subItem.handler] : undefined}
                              className="group flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/50"
                            >
                              {React.cloneElement(subItem.icon as React.ReactElement, {
                                className: "mr-3 h-5 w-5 text-gray-500 dark:text-gray-400",
                                strokeWidth: 1.5,
                              })}
                              <span>{subItem.label}</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div key={item.label} className="relative">
                  {item.path ? (
                    <Link
                      to={item.path}
                      className={cn(
                        "group relative flex items-center gap-4 rounded-lg px-4 py-3 text-base font-medium transition-all duration-300",
                        isActive(item.path)
                          ? "bg-primary-blue/10 dark:bg-primary-blue/20 text-primary-blue dark:text-primary-magenta"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/50"
                      )}
                    >
                      {/* Active indicator bar */}
                      <div
                        className={cn(
                          "absolute left-0 top-0 h-full w-1 rounded-l-lg bg-primary-blue dark:bg-primary-magenta transition-transform duration-300",
                          isActive(item.path) ? "transform scale-y-100" : "transform scale-y-0"
                        )}
                      />
                      
                      {/* Icon with transition */}
                      <div
                        className={cn(
                          "transition-transform duration-300",
                          isActive(item.path) 
                            ? "transform translate-x-1" 
                            : "transform translate-x-0 group-hover:translate-x-1"
                        )}
                      >
                        {React.cloneElement(item.icon as React.ReactElement, {
                          className: cn(
                            "h-7 w-7 flex-shrink-0 transition-colors duration-300",
                            isActive(item.path)
                              ? isDark ? "text-primary-magenta" : "text-primary-blue"
                              : "text-gray-500 dark:text-gray-400"
                          ),
                          strokeWidth: 1.5,
                        })}
                      </div>
                      
                      {/* Label with transition */}
                      {!isCollapsed && (
                        <span
                          className={cn(
                            "transition-all duration-300",
                            isActive(item.path) 
                              ? "transform translate-x-1" 
                              : "transform translate-x-0"
                          )}
                        >
                          {item.label}
                        </span>
                      )}
                    </Link>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handlerMap[item.handler] ? handlerMap[item.handler] : undefined}
                          className="group relative flex w-full items-center gap-4 rounded-lg px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-all duration-300"
                        >
                          {/* Icon with transition */}
                          <div className="transition-transform duration-300 group-hover:translate-x-1">
                            {React.cloneElement(item.icon as React.ReactElement, {
                              className: "h-7 w-7 text-gray-500 dark:text-gray-400",
                              strokeWidth: 1.5,
                            })}
                          </div>
                          
                          {/* Label */}
                          {!isCollapsed && <span>{item.label}</span>}
                        </button>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent side="right" className="bg-gray-800 text-white">
                          <p>{item.tooltipText || item.label}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  )}
                </div>
              )
            ))}
          </nav>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default SidebarNav;
