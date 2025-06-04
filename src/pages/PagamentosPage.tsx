
import React from 'react';
import PagamentosTabs from '@/components/pagamentos/PagamentosTabs';
import TransferenciasContent from '@/components/pagamentos/TransferenciasContent';
import { useEnsureCompanySelected } from '@/hooks/useEnsureCompanySelected';
import CompanyRequiredMessage from '@/components/common/CompanyRequiredMessage';

const PagamentosPage = () => {
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
      <PagamentosTabs>
        <TransferenciasContent />
      </PagamentosTabs>
    </div>
  );
};

export default PagamentosPage;
