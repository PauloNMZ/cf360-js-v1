
import React from 'react';
import RecebimentosTabs from '@/components/recebimentos/RecebimentosTabs';
import BoletosContent from '@/components/recebimentos/BoletosContent';

const RecebimentosPage = () => {
  return (
    <div className="container mx-auto py-8">
      <RecebimentosTabs>
        <BoletosContent />
      </RecebimentosTabs>
    </div>
  );
};

export default RecebimentosPage;
