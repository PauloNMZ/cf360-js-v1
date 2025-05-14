
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import SidebarSubmenuItem from "./SidebarSubmenuItem";

interface SidebarSubmenuProps {
  item: {
    label: string;
    icon: React.ReactElement;
    submenu?: Array<{
      path?: string;
      label: string;
      icon: React.ReactElement;
      handler?: string;
    }>;
  };
  isCollapsed: boolean;
  handlerMap: Record<string, () => void>;
  isActive: (path?: string) => boolean;
}

const SidebarSubmenu = ({ item, isCollapsed, handlerMap, isActive }: SidebarSubmenuProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(prev => prev === label ? null : label);
  };

  return (
    <div className="relative">
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
          {React.cloneElement(item.icon, {
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
      {openSubmenu === item.label && !isCollapsed && item.submenu && (
        <div className="ml-7 mt-1 space-y-1">
          {item.submenu.map((subItem) => (
            <SidebarSubmenuItem 
              key={subItem.label} 
              subItem={subItem} 
              isActive={isActive}
              handlerMap={handlerMap}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarSubmenu;
