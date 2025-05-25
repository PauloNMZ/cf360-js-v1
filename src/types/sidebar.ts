
export interface SidebarModuleChild {
  name: string;
  link: string;
  icon?: string;
}

export interface SidebarModule {
  name: string;
  icon: string; // Nome da string do ícone do lucide-react
  path?: string; // Caminho direto do módulo, opcional
  children?: SidebarModuleChild[]; // Submenus/tab children
}

export interface MainSidebarProps {
  modules: SidebarModule[];
  selectedModule: string;
  onModuleSelect?: (moduleName: string) => void;
  onNavigate?: (link: string) => void;
}
