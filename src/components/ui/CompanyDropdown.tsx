
import React, { useEffect } from 'react';
import { Building2, ChevronDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { companySelectionService } from '@/services/companySelectionService';

interface CompanyDropdownProps {
  companies: { id: number; name: string }[];
  selectedCompanyId?: number;
  onSelectCompany: (company: { id: number; name: string }) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  persistSelection?: boolean;
}

const CompanyDropdown: React.FC<CompanyDropdownProps> = ({
  companies,
  selectedCompanyId,
  onSelectCompany,
  placeholder = "Selecionar empresa...",
  disabled = false,
  className,
  persistSelection = true
}) => {
  const selectedCompany = companies.find(company => company.id === selectedCompanyId);

  const handleCompanySelect = (company: { id: number; name: string }) => {
    onSelectCompany(company);
    
    // Persist selection to the centralized service if enabled
    if (persistSelection) {
      companySelectionService.setSelectedCompany({
        id: company.id.toString(),
        razaoSocial: company.name,
        cnpj: '' // CNPJ not available in this interface
      });
    }
  };

  // Listen for external company selection changes
  useEffect(() => {
    if (!persistSelection) return;

    const unsubscribe = companySelectionService.subscribe((company) => {
      if (company) {
        const companyId = parseInt(company.id);
        const matchingCompany = companies.find(c => c.id === companyId);
        if (matchingCompany && matchingCompany.id !== selectedCompanyId) {
          onSelectCompany(matchingCompany);
        }
      }
    });

    return unsubscribe;
  }, [companies, selectedCompanyId, onSelectCompany, persistSelection]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-between",
            className
          )}
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="truncate">
              {selectedCompany ? selectedCompany.name : placeholder}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-full min-w-[200px] bg-white dark:bg-gray-800 border shadow-lg z-50"
        align="start"
      >
        {companies.length === 0 ? (
          <DropdownMenuItem disabled className="text-muted-foreground">
            Nenhuma empresa disponível
          </DropdownMenuItem>
        ) : (
          companies.map((company) => (
            <DropdownMenuItem
              key={company.id}
              onSelect={() => handleCompanySelect(company)}
              className="cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="truncate">{company.name}</span>
              </div>
              {selectedCompanyId === company.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CompanyDropdown;
