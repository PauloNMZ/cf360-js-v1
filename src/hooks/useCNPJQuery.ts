
import { useState, useRef, useEffect } from 'react';

export type CNPJData = {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  telefone: string;
  email: string;
  ddd_telefone_1: string;
  ddd_telefone_2: string;
  qsa: Array<{
    nome_socio: string;
    qualificacao_socio: string;
  }>;
  [key: string]: any;
};

type UseCNPJQueryProps = {
  onSuccess?: (data: CNPJData) => void;
  onError?: (error: string) => void;
};

export const useCNPJQuery = ({ onSuccess, onError }: UseCNPJQueryProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CNPJData | null>(null);
  const isQueryRunning = useRef(false);
  const queryCount = useRef(0); // Add a counter for tracking queries
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastCNPJRef = useRef<string>('');

  // Cleanup effect to abort any pending requests when unmounting
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const cleanCNPJ = (cnpj: string): string => {
    return cnpj.replace(/\D/g, '');
  };

  const fetchCNPJ = async (cnpj: string) => {
    setError(null);
    
    const cleanedCNPJ = cleanCNPJ(cnpj);
    
    // If we're already searching for this CNPJ, don't start a new search
    if (cleanedCNPJ === lastCNPJRef.current && isQueryRunning.current) {
      console.log("Same CNPJ search requested, ignoring duplicate");
      return { success: false, error: "Duplicate search" };
    }
    
    lastCNPJRef.current = cleanedCNPJ;
    
    // Prevent multiple simultaneous queries
    if (isQueryRunning.current) {
      console.log("CNPJ query is already running. Aborting previous request.");
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    isQueryRunning.current = true;
    
    const currentQuery = ++queryCount.current;
    console.log(`Starting CNPJ fetch (${currentQuery}):`, cleanedCNPJ);
    
    try {
      const response = await fetch(
        `https://brasilapi.com.br/api/cnpj/v1/${cleanedCNPJ}`, 
        { signal: abortControllerRef.current.signal }
      );
      
      // If this isn't the latest query, ignore the result
      if (currentQuery !== queryCount.current) {
        console.log(`Query ${currentQuery} superseded, ignoring response`);
        return { success: false, error: "Superseded" };
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao consultar CNPJ');
      }
      
      const responseData: CNPJData = await response.json();
      
      // Verify we got a valid business name
      if (!responseData.razao_social || responseData.razao_social.trim() === '') {
        throw new Error('CNPJ encontrado, mas sem razão social definida');
      }
      
      console.log(`Query ${currentQuery} successful with data:`, responseData.cnpj);
      
      setData(responseData);
      
      if (onSuccess) {
        onSuccess(responseData);
      }
      
      return { success: true, data: responseData };
    } catch (error) {
      // If this is an abort error, don't report it
      if ((error as any).name === 'AbortError') {
        console.log('Request was aborted');
        return { success: false, error: 'Request aborted' };
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
      
      console.error("Erro na consulta de CNPJ:", error);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
      // Reset the query flag with a small delay to prevent immediate re-triggering
      setTimeout(() => {
        if (currentQuery === queryCount.current) {
          console.log(`Query ${currentQuery} complete, resetting flag`);
          isQueryRunning.current = false;
        }
      }, 500);
    }
  };

  return { fetchCNPJ, isLoading, error, data };
};
