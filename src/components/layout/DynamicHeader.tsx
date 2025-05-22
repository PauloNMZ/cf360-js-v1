
import React from "react";
import { formatCNPJ } from "@/utils/formValidation";
import { TypographyH2, TypographyMuted } from "@/components/ui/typography";

type DynamicHeaderProps = {
  company: { name: string; cnpj: string } | null;
};

const DynamicHeader: React.FC<DynamicHeaderProps> = ({ company }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950 py-4 px-6 shadow relative w-full">
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
        <div className="flex items-center gap-3">
          <TypographyH2 className="text-white font-poppins text-2xl tracking-tight whitespace-nowrap">
            ConnectPag
          </TypographyH2>
          {company && (
            <span className="ml-4 flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
              <span className="text-white font-inter font-semibold text-base truncate max-w-xs" title={company.name}>
                • {company.name}
              </span>
              <span className="hidden sm:inline text-xs text-slate-200/90 px-2 select-none">|</span>
              <TypographyMuted className="truncate text-xs sm:text-sm text-slate-300 font-inter">
                CNPJ: {formatCNPJ(company.cnpj)}
              </TypographyMuted>
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default DynamicHeader;
