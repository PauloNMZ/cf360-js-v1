import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import classNames from 'classnames';
import { useCompanySettings } from '@/hooks/useCompanySettings';
import AppLogo from '@/components/AppLogo';
import ThemeToggle from '@/components/ThemeToggle';
import { LogoutButton } from '@/components/LogoutButton';
import SidebarNav from '@/components/SidebarNav';
import SidebarFooter from '@/components/SidebarFooter';

const SidebarLayout: React.FC<any> = ({ children }) => {
  const location = useLocation();
  const [activeMenuLabel, setActiveMenuLabel] = useState<string | null>(null);
  const [activeSubMenuPath, setActiveSubMenuPath] = useState<string | null>(null);
  const [openSubmenuLabel, setOpenSubmenuLabel] = useState<string | null>(null);

  const { companySettings, isLoading } = useCompanySettings();

  useEffect(() => {
    // Logic to determine active menu based on location
    // This part might need refinement based on your exact route structure
    // For simplicity, let's just reset active state on location change
    setActiveMenuLabel(null);
    setActiveSubMenuPath(null);
    setOpenSubmenuLabel(null);
  }, [location.pathname]);

  const isActive = (path: string, label: string, hasSubmenu: boolean) => {
    if (hasSubmenu) {
      // A parent menu is active if a submenu item within it is active
      // OR if the submenu is explicitly open and no subitem is active
      return activeMenuLabel === label || (openSubmenuLabel === label && activeSubMenuPath === null);
    } else {
      // A simple item is active if its path matches the current location
      // AND no submenu is currently open without an active subitem
      return location.pathname === path && !(openSubmenuLabel !== null && activeSubMenuPath === null);
    }
  };

  const handleItemClick = (path: string, label: string, hasSubmenu: boolean) => {
    if (hasSubmenu) {
      setActiveMenuLabel(label);
      setActiveSubMenuPath(null); // Reset submenu path when clicking parent
      setOpenSubmenuLabel(openSubmenuLabel === label ? null : label); // Toggle submenu
    } else {
      setActiveMenuLabel(null); // Deactivate parent menu highlight for simple items
      setActiveSubMenuPath(path);
      setOpenSubmenuLabel(null); // Close any open submenu when a simple item is clicked
    }
  };

  const handleSubmenuItemClick = (path: string, parentLabel: string) => {
    setActiveMenuLabel(parentLabel);
    setActiveSubMenuPath(path);
    // Keep the parent menu open when a submenu item is clicked
    setOpenSubmenuLabel(parentLabel);
  };

  // This function will be passed down to SidebarNav and called when any simple item is clicked
  const handleAnyItemClick = () => {
    setOpenSubmenuLabel(null); // Close submenu when any simple item is clicked
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between h-16 px-4 bg-gradient-to-r from-blue-500 to-green-500 text-white">
        {/* Logo and Company Name */}
        <div className="flex items-center space-x-2">
          <AppLogo className="h-8 w-auto" />
          <span className="text-lg font-semibold">
            {isLoading ? 'Carregando...' : companySettings?.companyName || 'Connect Pag'}
          </span>
        </div>
        {/* Email, Avatar, Logout */}
        <div className="flex items-center space-x-4">
          {/* Assume User Info/Avatar section exists here or is added */}
          {/* Logout Button */}
          <LogoutButton />
        </div>
      </header>

      {/* Layout Container below Header */}
      <div className="flex flex-1 mt-16"> {/* mt-16 accounts for the header height */}
        {/* Sidebar */}
        <aside className="fixed top-16 bottom-0 left-0 w-64 bg-gray-100 dark:bg-gray-800 flex flex-col"> {/* Adjust width if needed, top-16 accounts for header */}
          {/* Sidebar Navigation Area (flexible and scrollable) */}
          <div className="flex-1 overflow-y-auto">
            <SidebarNav
              activeMenuLabel={activeMenuLabel}
              activeSubMenuPath={activeSubMenuPath}
              openSubmenuLabel={openSubmenuLabel}
              isActive={isActive}
              handleItemClick={handleItemClick}
              handleSubmenuItemClick={handleSubmenuItemClick}
              onAnyItemClick={handleAnyItemClick} // Pass the new handler down
            />
          </div>

          {/* SidebarFooter at the bottom */}
          <div className="p-4">
            <SidebarFooter />
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 ml-64 p-4 overflow-y-auto"> {/* ml-64 accounts for sidebar width */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout; 