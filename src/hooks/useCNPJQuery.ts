
import { useState } from 'react';

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

  const cleanCNPJ = (cnpj: string): string => {
    return cnpj.replace(/\D/g, '');
  };

  const fetchCNPJ = async (cnpj: string) => {
    setError(null);
    
    const cleanedCNPJ = cleanCNPJ(cnpj);
    
    setIsLoading(true);
    
    try {
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
        
        // Set focus to the WhatsApp/celular field after successful CNPJ search
        setTimeout(() => {
          const celularInput = document.querySelector('input[name="celular"]') as HTMLInputElement;
          if (celularInput) {
            celularInput.focus();
          }
        }, 100);
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
    }
  };

  return { fetchCNPJ, isLoading, error, data };
};
