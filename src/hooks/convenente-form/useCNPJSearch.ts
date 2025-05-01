
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useCNPJQuery } from "@/hooks/useCNPJQuery";
import { formatCNPJ } from "@/utils/formValidation";
import { ConvenenteData } from "@/types/convenente";

export const useCNPJSearch = (
  formData: ConvenenteData,
  setFormData: React.Dispatch<React.SetStateAction<ConvenenteData>>,
  setDataLoaded: React.Dispatch<React.SetStateAction<boolean>>,
  setTouched: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
) => {
  const { toast } = useToast();
  const [cnpjInput, setCnpjInput] = useState("");

  const { fetchCNPJ, isLoading } = useCNPJQuery({
    onSuccess: (data) => {
      // Make sure a valid business name was received
      if (!data.razao_social || data.razao_social.trim() === '') {
        toast({
          title: "Dados incompletos",
          description: "A consulta não retornou uma razão social válida.",
          variant: "destructive",
        });
        return;
      }
      
      const formattedData = {
        cnpj: data.cnpj || "",
        razaoSocial: data.razao_social || "",
        endereco: data.logradouro || "",
        numero: data.numero || "",
        complemento: data.complemento || "",
        uf: data.uf || "",
        cidade: data.municipio || "",
        contato: data.qsa && data.qsa.length > 0 ? data.qsa[0].nome_socio || "" : "",
        fone: data.ddd_telefone_1 ? formatPhone(data.ddd_telefone_1) : "",
        celular: data.ddd_telefone_2 ? formatPhone(data.ddd_telefone_2) : "",
        email: data.email || "",
        agencia: formData.agencia || "",  // Preserve fields not from API
        conta: formData.conta || "",
        chavePix: formData.chavePix || "",
        convenioPag: formData.convenioPag || ""
      };
      
      console.log("Dados formatados da API:", formattedData);
      
      setFormData(formattedData);
      setDataLoaded(true);
      
      // Mark fields as touched based on their values
      setTouched({
        cnpj: true,
        razaoSocial: true,
        endereco: Boolean(formattedData.endereco),
        email: Boolean(formattedData.email),
        fone: Boolean(formattedData.fone),
        celular: Boolean(formattedData.celular)
      });
      
      toast({
        title: "Dados encontrados",
        description: `CNPJ ${data.cnpj} carregado com sucesso.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao consultar CNPJ",
        description: `${error}`,
        variant: "destructive",
      });
    }
  });

  const handleCNPJSearch = () => {
    // Remove non-numeric characters
    const cnpjClean = cnpjInput.replace(/\D/g, '');
    
    // Check if there's input before querying
    if (!cnpjClean) {
      toast({
        title: "Campo vazio",
        description: "Digite um CNPJ para pesquisar.",
        variant: "destructive",
      });
      return;
    }
    
    fetchCNPJ(cnpjClean);
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCnpjInput(formatCNPJ(value));
    setFormData(prev => ({
      ...prev,
      cnpj: value.replace(/\D/g, '')
    }));
  };

  return {
    cnpjInput,
    setCnpjInput,
    isLoading,
    handleCNPJSearch,
    handleCNPJChange
  };
};

// Helper function copied from formValidation.ts to avoid circular dependencies
const formatPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 11) {
    if (cleaned.length <= 10) {
      return cleaned
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    } else {
      return cleaned
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    }
  }
  return cleaned.substring(0, 11);
};
