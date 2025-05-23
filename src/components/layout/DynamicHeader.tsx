import React from 'react';
import { TypographyMuted, TypographySmall } from '@/components/ui/typography';
import { AppLogo } from '@/components/ui/AppLogo';
import { useCompanySettings } from '@/hooks/convenente/useCompanySettings'; // Assuming this hook is still needed for the main logo
import { useIndexPageContext } from '@/hooks/useIndexPageContext'; // Assuming context is needed for company settings for the logo

interface DynamicHeaderProps {
  company: { razaoSocial: string; cnpj: string } | null;
}

const DynamicHeader: React.FC<DynamicHeaderProps> = ({
  company
}) => {
  // Assuming companySettings is still needed for the logo, if not, remove
  const { adminPanelOpen } = useIndexPageContext(); // Or wherever adminPanelOpen comes from
  const { companySettings } = useCompanySettings(adminPanelOpen);

  return (
    <header className="bg-gradient-to-r from-[#3b82f6] to-[#1e40af] dark:from-[#0E1F46] dark:to-[#0A1C3A] text-white py-5 px-8 shadow-lg">
      <div className="flex items-center justify-between h-full px-4">
        {/* Logo e Nome da Empresa Fixa */}
        <div className="flex items-center gap-2 ml-[-8px]">
          {/* Assumindo que AppLogo precisa dessas props */}
          <AppLogo
            size={40}
            customLogoUrl={companySettings?.logoUrl}
            className="flex-shrink-0"
          />
          <span className="text-2xl font-semibold tracking-tight">
            ConnectPag
          </span>

          {/* Nome e CNPJ da Empresa Selecionada (Dinâmico) */}
          {company && (
            <div className="ml-4 flex flex-col">
              <TypographyMuted className="text-white text-lg font-semibold">{company.razaoSocial}</TypographyMuted>
              <TypographySmall className="text-gray-200">CNPJ: {company.cnpj}</TypographySmall>
            </div>
          )}
        </div>

        {/* Espaço reservado para Email, Avatar e Sair (serão passados como children ou via contexto) */}
        {/* Por enquanto, deixamos um espaço flexível */}
        <div className="flex-1"></div>

        {/* Email, Avatar e Sair - Conteúdo a ser definido, talvez passado via children ou contexto no SidebarLayout */}
        {/* Exemplo: {rightContent} */}

      </div>
    </header>
  );
};

export default DynamicHeader; 