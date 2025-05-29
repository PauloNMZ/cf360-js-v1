
import React, { useState } from 'react';
import LancamentoButtons from './LancamentoButtons';
import LancamentoFavorecidos from './LancamentoFavorecidos';
import LancamentoGrupos from './LancamentoGrupos';
import { ImportarPlanilha, ImportarCNAB } from './LancamentoPlaceholders';

const TransferenciasContent = () => {
  const [activeLancamentoTab, setActiveLancamentoTab] = useState<'favorecidos' | 'grupos' | 'planilha' | 'cnab' | null>(null);

  console.log("TransferenciasContent - activeLancamentoTab:", activeLancamentoTab);

  const renderLancamentoContent = () => {
    console.log("renderLancamentoContent - switch case:", activeLancamentoTab);
    
    switch (activeLancamentoTab) {
      case 'favorecidos':
        console.log("Renderizando LancamentoFavorecidos");
        return <LancamentoFavorecidos />;
      case 'grupos':
        console.log("Renderizando LancamentoGrupos");
        return <LancamentoGrupos />;
      case 'planilha':
        console.log("Renderizando ImportarPlanilha");
        return <ImportarPlanilha />;
      case 'cnab':
        console.log("Renderizando ImportarCNAB");
        return <ImportarCNAB />;
      default:
        console.log("Renderizando default message");
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
