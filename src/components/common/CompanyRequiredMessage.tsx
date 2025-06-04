
import React from 'react';
import { useIndexPageContext } from '@/hooks/useIndexPageContext';
import CompanySelectionDropdown from './CompanySelectionDropdown';

interface CompanyRequiredMessageProps {
  isEnsuring: boolean;
  onEnsureCompany: () => void;
}

const CompanyRequiredMessage: React.FC<CompanyRequiredMessageProps> = ({ 
  isEnsuring, 
  onEnsureCompany 
}) => {
  const { 
    convenentes, 
    handleSelectConvenente, 
    setFormMode, 
    setModalOpen 
  } = useIndexPageContext();

  const handleSelectCompany = (convenente: any) => {
    console.log("CompanyRequiredMessage - selecting company:", convenente);
    handleSelectConvenente(convenente, 'view');
  };

  const handleCreateNew = () => {
    console.log("CompanyRequiredMessage - creating new company");
    setFormMode('create');
    setModalOpen(true);
  };

  return (
    <CompanySelectionDropdown
      convenentes={convenentes || []}
      isLoading={isEnsuring}
      onSelectCompany={handleSelectCompany}
      onCreateNew={handleCreateNew}
    />
  );
};

export default CompanyRequiredMessage;
