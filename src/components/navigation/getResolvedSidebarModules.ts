
import { ReactElement } from "react";
import { SidebarModule, SidebarModuleChild } from "@/types/sidebar";
import { getIconComponent } from "./ModularNavigationConfig";

/**
 * Retorna os módulos do sidebar com os ícones resolvidos (React nodes) para facilitar o consumo em componentes React.
 * Por padrão, usa tamanho 20 nos ícones.
 * 
 * @param modules - Array de módulos conforme SidebarModule (ex: modularNavigationConfig)
 * @param iconSize - Tamanho dos ícones em px (opcional, padrão 20)
 * @returns Novo array de módulos idêntico, mas com `icon` substituído por React node (apenas nos módulos principais)
 */
export function getResolvedSidebarModules(
  modules: SidebarModule[],
  iconSize: number = 20
): Array<Omit<SidebarModule, "icon"> & { icon: ReactElement }> {
  return modules.map((module) => {
    // Resolve ícone do módulo principal
    const resolvedIcon = getIconComponent(module.icon, iconSize);

    // Os filhos *permanecem* tipo original (string ou undefined);
    // evite transformar, já que SidebarModuleChild.icon é string
    let resolvedChildren: SidebarModuleChild[] | undefined = undefined;
    if (module.children && Array.isArray(module.children)) {
      resolvedChildren = module.children.map((child) => ({
        ...child, // mantém icon: string | undefined
      }));
    }

    return {
      ...module,
      icon: resolvedIcon,
      ...(resolvedChildren ? { children: resolvedChildren } : {}),
    };
  });
}
