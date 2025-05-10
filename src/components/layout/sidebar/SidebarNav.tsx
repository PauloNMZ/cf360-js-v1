
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FileSpreadsheet, FileText, UsersRound } from "lucide-react";
import { 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from "@/components/ui/sidebar";
import { navigationItems } from "@/components/navigation/NavigationConfig";

interface SidebarNavProps {
  handlerMap: Record<string, () => void>;
}

const SidebarNav = ({ handlerMap }: SidebarNavProps) => {
  const location = useLocation();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Principal</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {/* Main navigation items */}
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton 
                  onClick={() => handlerMap[item.handler] ? handlerMap[item.handler]() : undefined}
                  className={item.className || ""}
                  tooltip={item.tooltipText}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Pagamentos</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === "/pagamentos/individual"}>
                <Link to="/pagamentos/individual">
                  <FileText />
                  <span>Individual</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === "/pagamentos/grupo"}>
                <Link to="/pagamentos/grupo">
                  <UsersRound />
                  <span>Por Grupo</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === "/pagamentos/multi-grupo"}>
                <Link to="/pagamentos/multi-grupo">
                  <FileSpreadsheet />
                  <span>Multi-grupos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Gestão</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === "/grupos"}>
                <Link to="/grupos">
                  <UsersRound />
                  <span>Gerenciar Grupos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default SidebarNav;
