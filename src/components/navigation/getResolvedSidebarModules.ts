
import { ReactElement } from "react";
import { SidebarModule, SidebarModuleChild } from "@/types/sidebar";
import { getIconComponent } from "./ModularNavigationConfig";

/**
 * Retorna os módulos do sidebar com os ícones resolvidos (React nodes) para facilitar o consumo em componentes React.
 * Por padrão, usa tamanho 20 nos ícones.
 * 
 * @param modules - Array de módulos conforme SidebarModule (ex: modularNavigationConfig)
 * @param iconSize - Tamanho dos ícones em px (opcional, padrão 20)
 * @returns Novo array de módulos idêntico, mas com `icon` substituído por React node
 */
export function getResolvedSidebarModules(
  modules: SidebarModule[],
  iconSize: number = 20
): Array<Omit<SidebarModule, "icon"> & { icon: ReactElement }> {
  return modules.map((module) => {
    // Resolve ícone do módulo principal
    const resolvedIcon = getIconComponent(module.icon, iconSize);

    // Resolve ícones dos filhos, caso existam
    let resolvedChildren: SidebarModuleChild[] | undefined = undefined;
    if (module.children && Array.isArray(module.children)) {
      resolvedChildren = module.children.map((child) => {
        // Se algum dia os filhos tiverem `icon` como string, resolvemos aqui
        // (atualmente no ModularNavigationConfig só os módulos principais têm `icon`)
        return {
          ...child,
          icon: child.icon ? getIconComponent(child.icon, iconSize) : undefined,
        };
      });
    }

    return {
      ...module,
      icon: resolvedIcon,
      ...(resolvedChildren ? { children: resolvedChildren } : {}),
    };
  });
}
