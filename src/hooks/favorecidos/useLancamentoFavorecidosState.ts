
import { useState } from 'react';

export const useLancamentoFavorecidosState = () => {
  const [selectedFavorecido, setSelectedFavorecido] = useState<any>(null);
  const [selectedFavorecidos, setSelectedFavorecidos] = useState<string[]>([]);

  return {
    selectedFavorecido,
    setSelectedFavorecido,
    selectedFavorecidos,
    setSelectedFavorecidos
  };
};
