
import { useState, useCallback, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useCNPJQuery } from "@/hooks/useCNPJQuery";
import { formatCNPJ } from "@/utils/formValidation";
import { ConvenenteData } from "@/types/convenente";
import { ContactInfoSectionRef } from "@/components/ConvenenteForm/ContactInfoSection";

export const useCNPJSearch = (
  formData: ConvenenteData,
  setFormData: React.Dispatch<React.SetStateAction<ConvenenteData>>,
  setDataLoaded: React.Dispatch<React.SetStateAction<boolean>>,
  setTouched: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  contactRef: React.RefObject<ContactInfoSectionRef>
) => {
  const { toast } = useToast();
  const [cnpjInput, setCnpjInput] = useState("");
  const [isSearchPending, setIsSearchPending] = useState(false);
  const lastSearchRef = useRef(""); // Store last search term
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null); // For debounce
  const processingDataRef = useRef(false); // Flag to prevent multiple data processing
  
  const { fetchCNPJ, isLoading } = useCNPJQuery({
    onSuccess: (data) => {
      console.log("CNPJ API onSuccess callback triggered");
      
      // Prevent multiple processing of the same response
      if (processingDataRef.current) {
        console.log("Already processing CNPJ data, ignoring duplicate callback");
        return;
      }
      
      // Set processing flag
      processingDataRef.current = true;
      
      try {
        // Make sure a valid business name was received
        if (!data.razao_social || data.razao_social.trim() === '') {
          toast({
            title: "Dados incompletos",
            description: "A consulta não retornou uma razão social válida.",
            variant: "destructive",
          });
          setIsSearchPending(false);
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
        
        // Update form data
        setFormData(formattedData);
        
        // Mark data as loaded
        setDataLoaded(true);
        
        // Reset touched state first
        setTouched({});
        
        // Then mark fields as touched based on their values after a small delay
        setTimeout(() => {
          setTouched({
            cnpj: true,
            razaoSocial: Boolean(formattedData.razaoSocial)
          });
        }, 100);
        
        toast({
          title: "Dados encontrados",
          description: `CNPJ ${data.cnpj} carregado com sucesso.`,
        });
        
        // Focus the celular field immediately after state updates
        console.log("Attempting to focus celular field:", contactRef?.current);
        setTimeout(() => {
          if (contactRef?.current) {
            contactRef.current.focusCelularField();
            console.log("Focus set to celular field via ref after timeout");
          }
        }, 500);
      } finally {
        // Reset search pending state
        setIsSearchPending(false);
        // Reset processing flag after a small delay
        setTimeout(() => {
          processingDataRef.current = false;
        }, 500);
      }
    },
    onError: (error) => {
      toast({
        title: "Erro ao consultar CNPJ",
        description: `${error}`,
        variant: "destructive",
      });
      setIsSearchPending(false);
      lastSearchRef.current = ""; // Reset last search on error
      processingDataRef.current = false;
    }
  });

  // Improved debounced search function
  const handleCNPJSearch = useCallback(() => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Don't allow multiple searches to be triggered
    if (isLoading || isSearchPending || processingDataRef.current) {
      console.log("Search already in progress, ignoring request");
      return;
    }
    
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
    
    // Check if this CNPJ was just searched
    if (cnpjClean === lastSearchRef.current) {
      console.log("CNPJ was just searched, ignoring duplicate request");
      return;
    }
    
    // Set a flag to prevent repeated searches
    setIsSearchPending(true);
    lastSearchRef.current = cnpjClean;
    
    console.log("Initiating CNPJ search for:", cnpjClean);
    
    // Add a small delay before actually triggering the search
    searchTimeoutRef.current = setTimeout(() => {
      fetchCNPJ(cnpjClean);
    }, 300);
    
  }, [cnpjInput, isLoading, isSearchPending, toast, fetchCNPJ]);

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
