
import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AppLogo } from "@/components/ui/AppLogo";
import { useAuth } from "@/hooks/use-auth";
import { getContentContainerStyle } from "@/utils/viewportUtils";
import { CompanySettings } from "@/hooks/convenente/useCompanySettings";

type MainLayoutProps = {
  children: React.ReactNode;
  companySettings?: CompanySettings; // Make it optional
};

const MainLayout = ({ children, companySettings = { logoUrl: '', companyName: 'Gerador de Pagamentos' } }: MainLayoutProps) => {
  const { user } = useAuth();
  
  // Define header and footer heights
  const HEADER_HEIGHT = 80;
  const FOOTER_HEIGHT = 60;
  const HEIGHT_REDUCTION = 0;
  
  // Get content container style with no height reduction
  const contentContainerStyle = getContentContainerStyle(HEADER_HEIGHT, FOOTER_HEIGHT, 0, HEIGHT_REDUCTION);

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-slate-900 dark:text-white">
      {/* Header with gradient azul */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950 text-white py-4 px-6 shadow-md">
        <div className="w-full mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <AppLogo size={36} customLogoUrl={companySettings?.logoUrl} />
            <h1 className="text-2xl font-bold">{companySettings?.companyName}</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <p className="text-sm hidden sm:block">Conectado como: {user.email}</p>
            )}
          </div>
        </div>
      </header>

      {/* Conteúdo principal com rolagem controlada e altura total disponível */}
      <div className="flex-grow overflow-auto w-full" style={contentContainerStyle}>
        <div className="w-full h-full mx-auto">
          {children}
        </div>
      </div>
      
      {/* Status bar - Fixed at the bottom */}
      <footer className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950 text-white py-3 px-6">
        <div className="w-full mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold uppercase">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long' })}
            </h2>
            <p className="text-sm uppercase">
              {new Date().toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="text-right">
              <p className="text-sm">GeraPag 1.01</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
