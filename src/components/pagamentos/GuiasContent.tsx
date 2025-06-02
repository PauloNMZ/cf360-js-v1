
import React, { useState } from 'react';
import GuiasButtons from './GuiasButtons';

const GuiasContent = () => {
  const [activeGuiaTab, setActiveGuiaTab] = useState<string | null>(null);

  console.log("GuiasContent - activeGuiaTab:", activeGuiaTab);

  const renderGuiaContent = () => {
    console.log("renderGuiaContent - switch case:", activeGuiaTab);
    
    switch (activeGuiaTab) {
      case 'darf':
        return <p className="text-center text-muted-foreground">Conteúdo DARF em desenvolvimento.</p>;
      case 'gare-sp':
        return <p className="text-center text-muted-foreground">Conteúdo GARE SP em desenvolvimento.</p>;
      case 'gps':
        return <p className="text-center text-muted-foreground">Conteúdo GPS em desenvolvimento.</p>;
      case 'gnre':
        return <p className="text-center text-muted-foreground">Conteúdo GNRE em desenvolvimento.</p>;
      case 'fgts-digital':
        return <p className="text-center text-muted-foreground">Conteúdo FGTS DIGITAL em desenvolvimento.</p>;
      case 'contas-impostos':
        return <p className="text-center text-muted-foreground">Conteúdo CONTAS/IMPOSTOS em desenvolvimento.</p>;
      case 'deposito-judicial':
        return <p className="text-center text-muted-foreground">Conteúdo DEPÓSITO JUDICIAL em desenvolvimento.</p>;
      default:
        return (
          <p className="text-center text-muted-foreground">Selecione uma opção de guia acima.</p>
        );
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Opções de Guias</h2>
      <GuiasButtons 
        activeGuiaTab={activeGuiaTab}
        setActiveGuiaTab={setActiveGuiaTab}
      />

      <div className="mt-6 p-4 border rounded-md bg-background">
        {renderGuiaContent()}
      </div>
    </>
  );
};

export default GuiasContent;
