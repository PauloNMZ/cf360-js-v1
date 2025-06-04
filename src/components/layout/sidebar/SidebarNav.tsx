import React from "react";
import { useLocation } from "react-router-dom";
import { SidebarContent, SidebarGroup, SidebarGroupContent, useSidebar } from "@/components/ui/sidebar";
import { navigationItems } from "@/components/navigation/NavigationConfig";
import SidebarNavItem from "./components/SidebarNavItem";
import SidebarSubmenu from "./components/SidebarSubmenu";
interface SidebarNavProps {
  handlerMap: Record<string, () => void>;
  className?: string;
}
const SidebarNav = ({
  handlerMap,
  className
}: SidebarNavProps) => {
  const location = useLocation();
  const {
    state
  } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Estado global para submenu aberto
  const [openSubmenuLabel, setOpenSubmenuLabel] = React.useState<string | null>(null);

  // Descobre qual item ou subitem está ativo
  let activeMenuLabel: string | null = null;
  let activeSubMenuPath: string | null = null;
  for (const item of navigationItems) {
    if (item.submenu) {
      for (const subItem of item.submenu) {
        if (subItem.path && (location.pathname === subItem.path || location.pathname.startsWith(`${subItem.path}/`))) {
          activeMenuLabel = item.label;
          activeSubMenuPath = subItem.path;
        }
      }
      // Se o submenu está aberto e nenhum subitem está ativo, considerar o menu pai como ativo
      if (openSubmenuLabel === item.label && !activeSubMenuPath) {
        activeMenuLabel = item.label;
      }
    } else if (item.path && (location.pathname === item.path || location.pathname.startsWith(`${item.path}/`))) {
      activeMenuLabel = item.label;
    }
  }

  // Função para saber se o item está ativo
  const isActive = (path?: string, label?: string) => {
    // Se um submenu está aberto e nenhum subitem está ativo, só o menu pai deve ficar ativo
    if (openSubmenuLabel && !activeSubMenuPath) {
      return label === openSubmenuLabel;
    }
    if (path) return location.pathname === path || location.pathname.startsWith(`${path}/`);
    if (label) return activeMenuLabel === label;
    return false;
  };

  // Função para abrir submenu
  const handleSubmenuToggle = (label: string) => {
    setOpenSubmenuLabel(prev => prev === label ? null : label);
  };
  return <SidebarContent className="pt-5 py-[15px] px-0 mx-0 my-0">
      <SidebarGroup>
        <SidebarGroupContent>
          <nav className="flex-1 space-y-1 px-4">
            {navigationItems.map(item => item.submenu ? <SidebarSubmenu key={item.label} item={item} isCollapsed={isCollapsed} handlerMap={handlerMap} isActive={isActive} activeMenuLabel={activeMenuLabel} activeSubMenuPath={activeSubMenuPath} openSubmenuLabel={openSubmenuLabel} onSubmenuToggle={handleSubmenuToggle} /> : <SidebarNavItem key={item.label} item={item} isCollapsed={isCollapsed} handlerMap={handlerMap} isActive={isActive} activeMenuLabel={activeMenuLabel} onAnyItemClick={() => setOpenSubmenuLabel(null)} />)}
          </nav>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>;
};
export default SidebarNav;