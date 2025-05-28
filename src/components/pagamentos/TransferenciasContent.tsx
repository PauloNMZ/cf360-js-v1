
import React, { useState } from 'react';
import LancamentoButtons from './LancamentoButtons';
import LancamentoFavorecidos from './LancamentoFavorecidos';
import { LancamentoGrupos, ImportarPlanilha, ImportarCNAB } from './LancamentoPlaceholders';

const TransferenciasContent = () => {
  const [activeLancamentoTab, setActiveLancamentoTab] = useState<'favorecidos' | 'grupos' | 'planilha' | 'cnab' | null>(null);

  const renderLancamentoContent = () => {
    switch (activeLancamentoTab) {
      case 'favorecidos':
        return <LancamentoFavorecidos />;
      case 'grupos':
        return <LancamentoGrupos />;
      case 'planilha':
        return <ImportarPlanilha />;
      case 'cnab':
        return <ImportarCNAB />;
      default:
        return (
          <p className="text-center text-muted-foreground">Selecione uma opção de lançamento acima.</p>
        );
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold">Opções de Lançamento</h2>
      <LancamentoButtons 
        activeLancamentoTab={activeLancamentoTab}
        setActiveLancamentoTab={setActiveLancamentoTab}
      />

      <div className="mt-6 p-4 border rounded-md bg-background">
        {renderLancamentoContent()}
      </div>
    </>
  );
};

export default TransferenciasContent;
