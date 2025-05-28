
import React from 'react';
import PagamentosTabs from '@/components/pagamentos/PagamentosTabs';
import TransferenciasContent from '@/components/pagamentos/TransferenciasContent';

const PagamentosPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Página de Pagamentos</h1>

      <PagamentosTabs>
        <TransferenciasContent />
      </PagamentosTabs>
    </div>
  );
};

export default PagamentosPage;
