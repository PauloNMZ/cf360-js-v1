
import React from 'react';
import LancamentoGrupos from './LancamentoGrupos';

// Componente para lançamento por grupos - agora implementado
export { default as LancamentoGrupos } from './LancamentoGrupos';

// Placeholders para as outras funcionalidades
export const ImportarPlanilha = () => {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium mb-2">Importar Planilha</h3>
      <p className="text-muted-foreground">
        Funcionalidade para importar planilha de pagamentos em desenvolvimento.
      </p>
    </div>
  );
};

export const ImportarCNAB = () => {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium mb-2">Importar CNAB</h3>
      <p className="text-muted-foreground">
        Funcionalidade para importar arquivo CNAB em desenvolvimento.
      </p>
    </div>
  );
};
