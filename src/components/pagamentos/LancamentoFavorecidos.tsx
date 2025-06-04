
import React from 'react';
import LancamentoFavorecidosContainer from './favorecidos/LancamentoFavorecidosContainer';

interface LancamentoFavorecidosProps {
  hidePixColumn?: boolean;
  hideBankColumn?: boolean;
  hideTipoColumn?: boolean;
}

const LancamentoFavorecidos: React.FC<LancamentoFavorecidosProps> = (props) => {
  return <LancamentoFavorecidosContainer {...props} />;
};

export default LancamentoFavorecidos;
