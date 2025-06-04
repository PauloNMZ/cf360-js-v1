
import React from 'react';
import { useIndexPageContext } from '@/hooks/useIndexPageContext';
import { useConvenentesData } from '@/hooks/importacao/useConvenentesData';
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
    handleSelectConvenente, 
    setFormMode, 
    setModalOpen 
  } = useIndexPageContext();

  const { 
    convenentes, 
    carregandoConvenentes, 
    error, 
    retry 
  } = useConvenentesData();

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
      isLoading={isEnsuring || carregandoConvenentes}
      error={error}
      onSelectCompany={handleSelectCompany}
      onCreateNew={handleCreateNew}
      onRetry={retry}
    />
  );
};

export default CompanyRequiredMessage;
