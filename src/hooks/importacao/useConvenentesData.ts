
import { useState, useEffect } from 'react';
import { getConvenentes } from '@/services/convenente/convenenteService';
import { useNotificationModalContext } from '@/components/ui/NotificationModalProvider';

export const useConvenentesData = () => {
  const [convenentes, setConvenentes] = useState<Array<any>>([]);
  const [carregandoConvenentes, setCarregandoConvenentes] = useState(false);
  const { showError } = useNotificationModalContext();
  
  // Carregar convenentes do banco de dados
  useEffect(() => {
    const loadConvenentes = async () => {
      try {
        setCarregandoConvenentes(true);
        const data = await getConvenentes();
        console.log("Convenentes carregados:", data);
        setConvenentes(data);
      } catch (error) {
        console.error("Erro ao carregar convenentes:", error);
        showError("Erro!", "Erro ao carregar convenentes");
      } finally {
        setCarregandoConvenentes(false);
      }
    };
    
    loadConvenentes();
  }, [showError]);

  return { convenentes, carregandoConvenentes };
};
