
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, ChevronDown } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPix } from '@fortawesome/free-brands-svg-icons';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar 
} from "@/components/ui/sidebar";
import { MainSidebarProps } from "@/types/sidebar";
import { getIconComponent } from "@/components/navigation/ModularNavigationConfig";
import { cn } from "@/lib/utils";

const MainSidebar: React.FC<MainSidebarProps> = ({ 
  modules, 
  selectedModule, 
  onModuleSelect,
  onNavigate 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  // Debug: Log modules on mount
  useEffect(() => {
    console.log('🔍 MainSidebar - Modules received:', modules.map(m => ({ 
      name: m.name, 
      icon: m.icon,
      isPix: m.name.includes("PIX") || m.name.includes("Gestão de PIX")
    })));
  }, [modules]);

  const toggleModule = (moduleName: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleName)) {
      newExpanded.delete(moduleName);
    } else {
      newExpanded.add(moduleName);
    }
    setExpandedModules(newExpanded);
    
    if (onModuleSelect) {
      onModuleSelect(moduleName);
    }
  };

  const handleNavigation = (link: string) => {
    if (onNavigate) {
      onNavigate(link);
    } else {
      navigate(link);
    }
  };

  const isActiveModule = (module: any) => {
    if (module.path) {
      return location.pathname === module.path || location.pathname.startsWith(`${module.path}/`);
    }
    
    if (module.children) {
      return module.children.some((child: any) => 
        location.pathname === child.link || location.pathname.startsWith(`${child.link}/`)
      );
    }
    
    return selectedModule === module.name;
  };

  const isActiveChild = (link: string) => {
    return location.pathname === link || location.pathname.startsWith(`${link}/`);
  };

  // Function to render icon with multiple PIX detection strategies
  const renderIcon = (module: any) => {
    console.log(`🎨 Rendering icon for module: "${module.name}", icon: "${module.icon}"`);
    
    // Multiple strategies to detect PIX module
    const isPixModule = 
      module.name === "Gestão de PIX" || 
      module.name.includes("PIX") || 
      module.icon === "FaPix";
    
    console.log(`🎯 Is PIX module? ${isPixModule}`);
    
    if (isPixModule) {
      console.log('✅ Rendering FontAwesome PIX icon');
      return (
        <FontAwesomeIcon 
          icon={faPix} 
          className={cn("w-5 h-5 text-current", isCollapsed && "w-6 h-6")}
        />
      );
    }
    
    // Use the mapping system for other icons
    const lucideIcon = getIconComponent(module.icon, isCollapsed ? 24 : 20);
    console.log(`🔧 Using Lucide icon for ${module.name}`);
    return lucideIcon;
  };

  return (
    <Sidebar variant="sidebar" className="border-r border-border/20 bg-white/95 dark:bg-slate-950">
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-3">
              {modules.map((module) => {
                const isActive = isActiveModule(module);
                const isExpanded = expandedModules.has(module.name);
                const hasChildren = module.children && module.children.length > 0;

                return (
                  <SidebarMenuItem key={module.name} className="w-full">
                    {/* Module Button */}
                    <SidebarMenuButton
                      onClick={() => {
                        if (hasChildren) {
                          toggleModule(module.name);
                        } else if (module.path) {
                          handleNavigation(module.path);
                        }
                      }}
                      className={cn(
                        "group relative flex w-full items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all duration-200",
                        "hover:bg-gray-100 dark:hover:bg-slate-800/70",
                        isActive && "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500",
                        !isActive && "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      <div className={cn(
                        "transition-transform duration-300",
                        isActive && "translate-x-2"
                      )}>
                        {renderIcon(module)}
                      </div>
                      
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left">{module.name}</span>
                          {hasChildren && (
                            <div className="transition-transform duration-200">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </SidebarMenuButton>

                    {/* Children Submenu */}
                    {hasChildren && !isCollapsed && isExpanded && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                        {module.children!.map((child) => (
                          <button
                            key={child.link}
                            onClick={() => handleNavigation(child.link)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                              "hover:bg-gray-100 dark:hover:bg-slate-800/50",
                              isActiveChild(child.link)
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                                : "text-gray-600 dark:text-gray-400"
                            )}
                          >
                            <div className={cn(
                              "h-2 w-2 rounded-full transition-all duration-200",
                              isActiveChild(child.link) 
                                ? "bg-blue-500" 
                                : "bg-gray-300 dark:bg-gray-600"
                            )} />
                            <span className="text-left">{child.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default MainSidebar;
