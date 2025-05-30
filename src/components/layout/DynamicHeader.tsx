
import React, { useEffect } from "react";
import { AppLogo } from '@/components/ui/AppLogo';
import { TypographyMuted } from '@/components/ui/typography';
import { formatCNPJ } from "@/utils/formValidation";
import { useCompanySettings } from '@/hooks/convenente/useCompanySettings';
import { useIndexPageContext } from '@/hooks/useIndexPageContext';

interface DynamicHeaderProps {
  company: { razaoSocial: string; cnpj: string } | null;
}

const DynamicHeader: React.FC<DynamicHeaderProps> = ({ company }) => {
  // Get admin panel state if needed for companySettings
  const { adminPanelOpen, setSelectedHeaderCompany } = useIndexPageContext();
  const { companySettings } = useCompanySettings(adminPanelOpen);

  // Update the selected header company in context whenever the company prop changes
  useEffect(() => {
    console.log("DynamicHeader: Setting selected header company:", company);
    setSelectedHeaderCompany(company);
  }, [company, setSelectedHeaderCompany]);

  return (
    <header className="bg-gradient-to-r from-[#3b82f6] to-[#1e40af] dark:from-[#0E1F46] dark:to-[#0A1C3A] text-white py-5 px-8 shadow-lg">
      <div className="flex items-center justify-between h-full px-4">
        {/* Logo & Main Title */}
        <div className="flex items-center gap-2 ml-[-8px]">
          <AppLogo
            size={40}
            customLogoUrl={companySettings?.logoUrl}
            className="flex-shrink-0"
          />
          <span className="text-2xl font-semibold tracking-tight">
            ConnectPag
          </span>
          {/* Display company info if present */}
          {company && (
            <div className="ml-4 flex flex-col">
              <TypographyMuted className="text-white text-lg font-semibold">{company.razaoSocial}</TypographyMuted>
              <span className="text-gray-200 text-sm">CNPJ: {formatCNPJ(company.cnpj)}</span>
            </div>
          )}
        </div>
        {/* Placeholder for user area (email/avatar/sign out) */}
        <div className="flex-1"></div>
      </div>
    </header>
  );
};

export default DynamicHeader;
