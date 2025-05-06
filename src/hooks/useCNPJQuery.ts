
import { useState, useRef } from 'react';

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

  const cleanCNPJ = (cnpj: string): string => {
    return cnpj.replace(/\D/g, '');
  };

  const fetchCNPJ = async (cnpj: string) => {
    setError(null);
    
    // Prevent multiple simultaneous queries
    if (isQueryRunning.current) {
      console.log("CNPJ query is already running. Skipping duplicate request.");
      return { success: false, error: "Query is already running" };
    }
    
    const cleanedCNPJ = cleanCNPJ(cnpj);
    
    setIsLoading(true);
    isQueryRunning.current = true;
    
    try {
      console.log("Starting CNPJ fetch:", cleanedCNPJ);
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanedCNPJ}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao consultar CNPJ');
      }
      
      const responseData: CNPJData = await response.json();
      
      // Verificar se a razão social foi recebida
      if (!responseData.razao_social || responseData.razao_social.trim() === '') {
        throw new Error('CNPJ encontrado, mas sem razão social definida');
      }
      
      setData(responseData);
      
      if (onSuccess) {
        onSuccess(responseData);
      }
      
      return { success: true, data: responseData };
    } catch (error) {
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
        isQueryRunning.current = false;
      }, 500);
    }
  };

  return { fetchCNPJ, isLoading, error, data };
};
