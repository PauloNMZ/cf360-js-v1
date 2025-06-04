
import { useState, useEffect } from 'react';
import { getConvenentes } from '@/services/convenente/convenenteService';
import { useNotificationModalContext } from '@/components/ui/NotificationModalProvider';

export const useConvenentesData = () => {
  const [convenentes, setConvenentes] = useState<Array<any>>([]);
  const [carregandoConvenentes, setCarregandoConvenentes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useNotificationModalContext();
  
  // Carregar convenentes do banco de dados
  useEffect(() => {
    const loadConvenentes = async () => {
      try {
        setCarregandoConvenentes(true);
        setError(null);
        const data = await getConvenentes();
        console.log("Convenentes carregados:", data);
        setConvenentes(data);
      } catch (error: any) {
        console.error("Erro ao carregar convenentes:", error);
        const errorMessage = error.message || "Erro ao carregar convenentes";
        setError(errorMessage);
        showError("Erro!", errorMessage);
      } finally {
        setCarregandoConvenentes(false);
      }
    };
    
    loadConvenentes();
  }, [showError]);

  return { 
    convenentes, 
    carregandoConvenentes, 
    error,
    retry: () => {
      setError(null);
      // Trigger useEffect to reload
      setCarregandoConvenentes(true);
    }
  };
};
