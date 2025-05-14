
import React from "react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

interface SidebarNavItemProps {
  item: {
    path?: string;
    label: string;
    tooltipText?: string;
    icon: React.ReactElement;
    handler?: string;
  };
  isCollapsed: boolean;
  handlerMap: Record<string, () => void>;
  isActive: (path?: string) => boolean;
}

const SidebarNavItem = ({ item, isCollapsed, handlerMap, isActive }: SidebarNavItemProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  if (item.path) {
    return (
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
          {React.cloneElement(item.icon, {
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
    );
  }
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handlerMap[item.handler!] ? handlerMap[item.handler!] : undefined}
          className="group relative flex w-full items-center gap-4 rounded-lg px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-all duration-300"
        >
          {/* Icon with transition */}
          <div className="transition-transform duration-300 group-hover:translate-x-1">
            {React.cloneElement(item.icon, {
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
  );
};

export default SidebarNavItem;
