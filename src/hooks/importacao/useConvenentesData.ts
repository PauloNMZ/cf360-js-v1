
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { getConvenentes } from '@/services/convenenteService';

export const useConvenentesData = () => {
  const [convenentes, setConvenentes] = useState<Array<any>>([]);
  const [carregandoConvenentes, setCarregandoConvenentes] = useState(false);
  
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
        toast.error("Erro ao carregar convenentes");
      } finally {
        setCarregandoConvenentes(false);
      }
    };
    
    loadConvenentes();
  }, []);

  return { convenentes, carregandoConvenentes };
};
