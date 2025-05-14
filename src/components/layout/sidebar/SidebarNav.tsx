
import React from "react";
import { useLocation } from "react-router-dom";
import { SidebarContent, SidebarGroup, SidebarGroupContent, useSidebar } from "@/components/ui/sidebar";
import { navigationItems } from "@/components/navigation/NavigationConfig";
import SidebarNavItem from "./components/SidebarNavItem";
import SidebarSubmenu from "./components/SidebarSubmenu";

interface SidebarNavProps {
  handlerMap: Record<string, () => void>;
}

const SidebarNav = ({ handlerMap }: SidebarNavProps) => {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

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
                <SidebarSubmenu
                  key={item.label}
                  item={item}
                  isCollapsed={isCollapsed}
                  handlerMap={handlerMap}
                  isActive={isActive}
                />
              ) : (
                <SidebarNavItem
                  key={item.label}
                  item={item}
                  isCollapsed={isCollapsed}
                  handlerMap={handlerMap}
                  isActive={isActive}
                />
              )
            ))}
          </nav>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default SidebarNav;
