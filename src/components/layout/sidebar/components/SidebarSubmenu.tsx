
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

  const isOpen = openSubmenu === item.label;

  return (
    <div className="relative">
      <button
        onClick={() => toggleSubmenu(item.label)}
        className={cn(
          "group relative flex w-full items-center gap-4 rounded-lg px-4 py-3 text-base font-medium transition-all duration-300",
          isOpen
            ? "bg-primary-blue/10 dark:bg-primary-blue/20 text-primary-blue dark:text-primary-magenta"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/50"
        )}
      >
        {/* Active indicator bar */}
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-1 rounded-l-lg bg-primary-blue dark:bg-primary-magenta transition-transform duration-300",
            isOpen ? "transform scale-y-100" : "transform scale-y-0"
          )}
        />
        {/* Grupo que move ícone + label */}
        <div
          className={cn(
            "flex items-center gap-4 flex-1 transition-transform duration-300",
            isOpen ? "translate-x-2" : "translate-x-0 group-hover:translate-x-2"
          )}
        >
          {React.cloneElement(item.icon, {
            className: cn(
              "h-7 w-7 flex-shrink-0 transition-colors duration-300",
              isOpen
                ? isDark ? "text-primary-magenta" : "text-primary-blue"
                : "text-gray-500 dark:text-gray-400"
            ),
            strokeWidth: 1.5,
          })}
          {!isCollapsed && (
            <span
              className={cn(
                "transition-colors duration-300"
              )}
            >
              {item.label}
            </span>
          )}
        </div>
        {/* Dropdown icon (não move) */}
        {!isCollapsed && (
          <ChevronDown
            className={cn(
              "h-5 w-5 transition-transform duration-300",
              isOpen ? "rotate-180" : ""
            )}
          />
        )}
      </button>
      {/* Submenu items */}
      {isOpen && !isCollapsed && item.submenu && (
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
