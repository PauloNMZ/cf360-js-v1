
export interface SidebarModule {
  name: string;
  icon: string;
  children?: SidebarModuleChild[];
  path?: string;
}

export interface SidebarModuleChild {
  name: string;
  link: string;
  icon?: string;
}

export interface MainSidebarProps {
  modules: SidebarModule[];
  selectedModule: string;
  onModuleSelect?: (moduleName: string) => void;
  onNavigate?: (link: string) => void;
}
