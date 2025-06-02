
import React, { useState } from 'react';
import PixButtons from './PixButtons';
import LancamentoFavorecidos from './LancamentoFavorecidos';
import ImportarPlanilha from '@/components/ImportarPlanilha';

const PixContent = () => {
  const [activePixTab, setActivePixTab] = useState<'favorecidos' | 'planilha' | null>(null);

  console.log("PixContent - activePixTab:", activePixTab);

  const renderPixContent = () => {
    console.log("renderPixContent - switch case:", activePixTab);
    
    switch (activePixTab) {
      case 'favorecidos':
        console.log("Renderizando LancamentoFavorecidos");
        return <LancamentoFavorecidos />;
      case 'planilha':
        console.log("Renderizando ImportarPlanilha");
        return <ImportarPlanilha />;
      default:
        console.log("Renderizando default message");
        return (
          <p className="text-center text-muted-foreground">Selecione uma opção de lançamento PIX acima.</p>
        );
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Opções de Lançamento PIX</h2>
      <PixButtons 
        activePixTab={activePixTab}
        setActivePixTab={setActivePixTab}
      />

      <div className="mt-6 p-4 border rounded-md bg-background">
        {renderPixContent()}
      </div>
    </>
  );
};

export default PixContent;
