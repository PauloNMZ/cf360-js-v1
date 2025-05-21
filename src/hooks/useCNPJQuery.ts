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
    if (cleanedCNPJ === lastCNPJRef.current && isQueryRunning.current) {
      console.log("Same CNPJ search requested, ignoring duplicate");
      return { success: false, error: "Duplicate search" };
    }
    lastCNPJRef.current = cleanedCNPJ;
    if (isQueryRunning.current) {
      console.log("CNPJ query is already running. Aborting previous request.");
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    isQueryRunning.current = true;
    const currentQuery = ++queryCount.current;
    console.log(`Starting CNPJ fetch (${currentQuery}):`, cleanedCNPJ);
    // Função auxiliar para buscar na publica.cnpj.ws
    const fetchFromPublicaCNPJ = async () => {
      try {
        const response = await fetch(`https://publica.cnpj.ws/cnpj/${cleanedCNPJ}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao consultar CNPJ (publica.cnpj.ws)');
        }
        const responseData = await response.json();
        // Adapta os campos para o formato esperado
        const adaptedData: CNPJData = {
          cnpj: responseData.estabelecimento?.cnpj || responseData.cnpj || cleanedCNPJ,
          razao_social: responseData.razao_social || responseData.nome || '',
          nome_fantasia: responseData.estabelecimento?.nome_fantasia || '',
          logradouro: responseData.estabelecimento?.logradouro || '',
          numero: responseData.estabelecimento?.numero || '',
          complemento: responseData.estabelecimento?.complemento || '',
          bairro: responseData.estabelecimento?.bairro || '',
          municipio: responseData.estabelecimento?.cidade?.nome || '',
          uf: responseData.estabelecimento?.estado?.sigla || '',
          cep: responseData.estabelecimento?.cep || '',
          telefone: responseData.estabelecimento?.ddd1 && responseData.estabelecimento?.telefone1 ? `${responseData.estabelecimento.ddd1}${responseData.estabelecimento.telefone1}` : '',
          email: responseData.estabelecimento?.email || '',
          ddd_telefone_1: responseData.estabelecimento?.ddd1 || '',
          ddd_telefone_2: responseData.estabelecimento?.ddd2 || '',
          qsa: responseData.socios?.map((s: any) => ({ nome_socio: s.nome, qualificacao_socio: s.qualificacao })) || [],
        };
        setData(adaptedData);
        if (onSuccess) onSuccess(adaptedData);
        return { success: true, data: adaptedData };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido (publica.cnpj.ws)';
        setError(errorMessage);
        if (onError) onError(errorMessage);
        return { success: false, error: errorMessage };
      }
    };
    // Timeout para fallback
    let timeoutId: NodeJS.Timeout | null = null;
    let brasilapiResolved = false;
    try {
      const brasilapiPromise = new Promise(async (resolve, reject) => {
        try {
          const response = await fetch(
            `https://brasilapi.com.br/api/cnpj/v1/${cleanedCNPJ}`,
            { signal: abortControllerRef.current.signal }
          );
          if (currentQuery !== queryCount.current) {
            console.log(`Query ${currentQuery} superseded, ignoring response`);
            return resolve({ success: false, error: "Superseded" });
          }
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao consultar CNPJ');
          }
          const responseData: CNPJData = await response.json();
          if (!responseData.razao_social || responseData.razao_social.trim() === '') {
            throw new Error('CNPJ encontrado, mas sem razão social definida');
          }
          brasilapiResolved = true;
          setData(responseData);
          if (onSuccess) onSuccess(responseData);
          resolve({ success: true, data: responseData });
        } catch (error) {
          resolve({ success: false, error });
        }
      });
      // Timeout de 3 segundos para fallback
      const timeoutPromise = new Promise((resolve) => {
        timeoutId = setTimeout(() => resolve('timeout'), 3000);
      });
      const result = await Promise.race([brasilapiPromise, timeoutPromise]);
      if (timeoutId) clearTimeout(timeoutId);
      if (result === 'timeout' || (result && typeof result === 'object' && (result as any).success === false)) {
        // Fallback para publica.cnpj.ws
        return await fetchFromPublicaCNPJ();
      }
      return result;
    } catch (error) {
      // Fallback para publica.cnpj.ws
      return await fetchFromPublicaCNPJ();
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        if (currentQuery === queryCount.current) {
          isQueryRunning.current = false;
        }
      }, 500);
    }
  };

  return { fetchCNPJ, isLoading, error, data };
};
