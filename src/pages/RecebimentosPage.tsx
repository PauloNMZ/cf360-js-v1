
import React from 'react';
import RecebimentosTabs from '@/components/recebimentos/RecebimentosTabs';
import BoletosContent from '@/components/recebimentos/BoletosContent';
import { useEnsureCompanySelected } from '@/hooks/useEnsureCompanySelected';
import CompanyRequiredMessage from '@/components/common/CompanyRequiredMessage';

const RecebimentosPage = () => {
  const { 
    hasCompanySelected, 
    hasCompanyGuaranteed, 
    isEnsuring, 
    ensureCompanySelected 
  } = useEnsureCompanySelected();

  // Se ainda está garantindo que há empresa ou não há empresa selecionada
  if (isEnsuring || (!hasCompanySelected && !hasCompanyGuaranteed)) {
    return (
      <CompanyRequiredMessage 
        isEnsuring={isEnsuring}
        onEnsureCompany={ensureCompanySelected}
      />
    );
  }

  // Se há empresa selecionada, mostra o conteúdo normal
  return (
    <div className="container mx-auto py-8">
      <RecebimentosTabs>
        <BoletosContent />
      </RecebimentosTabs>
    </div>
  );
};

export default RecebimentosPage;
