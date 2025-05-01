
import { useState } from 'react';

type CNPJData = {
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

export const useCNPJQuery = ({ onSuccess, onError }: UseCNPJQueryProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchCNPJ = async (cnpj: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao consultar CNPJ');
      }
      
      const data: CNPJData = await response.json();
      
      if (onSuccess) {
        onSuccess(data);
      }
      
      return data;
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error.message : 'Erro desconhecido');
      }
      console.error("Erro na consulta de CNPJ:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchCNPJ, isLoading };
};
