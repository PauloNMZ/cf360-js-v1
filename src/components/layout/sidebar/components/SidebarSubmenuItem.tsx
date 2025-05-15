
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

interface SidebarSubmenuItemProps {
  subItem: {
    path?: string;
    label: string;
    icon: React.ReactElement;
    handler?: string;
  };
  isActive: (path?: string) => boolean;
  handlerMap: Record<string, () => void>;
}

const SidebarSubmenuItem = ({ subItem, isActive, handlerMap }: SidebarSubmenuItemProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (subItem.path) {
    return (
      <Link
        to={subItem.path}
        className={cn(
          "group flex items-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-200",
          isActive(subItem.path)
            ? "bg-primary-blue/10 dark:bg-primary-blue/20 text-primary-blue dark:text-primary-magenta"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/50"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 transition-transform duration-200",
            isActive(subItem.path)
              ? "translate-x-2"
              : "translate-x-0 group-hover:translate-x-2"
          )}
        >
          {React.cloneElement(subItem.icon, {
            className: cn(
              "mr-3 h-5 w-5",
              isActive(subItem.path)
                ? isDark ? "text-primary-magenta" : "text-primary-blue"
                : "text-gray-500 dark:text-gray-400"
            ),
            strokeWidth: 1.5,
          })}
          <span>{subItem.label}</span>
        </div>
      </Link>
    );
  }

  // Handler button
  return (
    <button
      onClick={handlerMap[subItem.handler!] ? handlerMap[subItem.handler!] : undefined}
      className="group flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/50"
    >
      <div className="flex items-center gap-2 transition-transform duration-200 group-hover:translate-x-2">
        {React.cloneElement(subItem.icon, {
          className: "mr-3 h-5 w-5 text-gray-500 dark:text-gray-400",
          strokeWidth: 1.5,
        })}
        <span>{subItem.label}</span>
      </div>
    </button>
  );
};

export default SidebarSubmenuItem;
