
import React from 'react';
import PagamentosTabs from '@/components/pagamentos/PagamentosTabs';
import TransferenciasContent from '@/components/pagamentos/TransferenciasContent';

const PagamentosPage = () => {
  return (
    <div className="container mx-auto py-8">
      <PagamentosTabs>
        <TransferenciasContent />
      </PagamentosTabs>
    </div>
  );
};

export default PagamentosPage;
