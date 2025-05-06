
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useCNPJQuery } from "@/hooks/useCNPJQuery";
import { ConvenenteData } from "@/types/convenente";
import { ContactInfoSectionRef } from "@/components/ConvenenteForm/ContactInfoSection";
import { formatCNPJ } from "@/utils/formatting/cnpjFormatter";
import { useDebounceSearch } from "./useDebounceSearch";
import { useCursorPosition } from "./useCursorPosition";

export const useCNPJSearch = (
  formData: ConvenenteData,
  setFormData: React.Dispatch<React.SetStateAction<ConvenenteData>>,
  setDataLoaded: React.Dispatch<React.SetStateAction<boolean>>,
  setTouched: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  contactRef: React.RefObject<ContactInfoSectionRef>
) => {
  const { toast } = useToast();
  const [cnpjInput, setCnpjInput] = useState("");
  const processingDataRef = useRef(false);
  const userEditingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  // Use the cursor position hook
  const { saveCursorState, restoreCursorPosition } = useCursorPosition();
  
  // Handle CNPJ API fetch success
  const handleCNPJSuccess = (data: any) => {
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
        setSearchPending(false);
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
        agencia: formData.agencia || "",
        conta: formData.conta || "",
        chavePix: formData.chavePix || "",
        convenioPag: formData.convenioPag || ""
      };
      
      console.log("Dados formatados da API:", formattedData);
      
      // Update form data
      setFormData(formattedData);
      
      // Set the formatted CNPJ in the input field
      if (data.cnpj) {
        setCnpjInput(formatCNPJ(data.cnpj));
      }
      
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
      setTimeout(() => {
        if (contactRef?.current) {
          contactRef.current.focusCelularField();
          console.log("Focus set to celular field via ref after timeout");
        }
      }, 500);
    } finally {
      // Reset search pending state
      setSearchPending(false);
      // Reset processing flag after a small delay
      setTimeout(() => {
        processingDataRef.current = false;
      }, 500);
    }
  };
  
  // Handle CNPJ API fetch errors
  const handleCNPJError = (error: any) => {
    toast({
      title: "Erro ao consultar CNPJ",
      description: `${error}`,
      variant: "destructive",
    });
    setSearchPending(false);
    lastSearchRef.current = ""; // Reset last search on error
    processingDataRef.current = false;
  };
  
  // Use the CNPJ API query hook
  const { fetchCNPJ, isLoading } = useCNPJQuery({
    onSuccess: handleCNPJSuccess,
    onError: handleCNPJError
  });

  // Helper function for phone formatting used only internally
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

  // Use the debounce search hook
  const { 
    debounceSearch, 
    setSearchPending, 
    isSearchPendingRef 
  } = useDebounceSearch({ 
    isLoading, 
    onSearch: fetchCNPJ
  });
  
  // CNPJ search handler
  const handleCNPJSearch = () => {
    debounceSearch(cnpjInput);
  };

  // CNPJ input change handler with cursor position preservation
  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Track that user is editing
    userEditingRef.current = true;
    
    const input = e.target;
    inputRef.current = input;
    
    // Save cursor position before formatting
    saveCursorState(input);
    
    // Format the CNPJ
    const formattedValue = formatCNPJ(input.value);
    console.log(`CNPJ formatting: "${input.value}" -> "${formattedValue}"`);
    
    // Update the display value
    setCnpjInput(formattedValue);
    
    // Update the underlying form data with only digits
    setFormData(prev => {
      const cnpjDigits = formattedValue.replace(/\D/g, '');
      return {
        ...prev,
        cnpj: cnpjDigits
      };
    });
    
    // Restore cursor position after state update
    setTimeout(() => {
      restoreCursorPosition(input);
      
      // Reset editing flag after a short delay
      setTimeout(() => {
        userEditingRef.current = false;
      }, 100);
    }, 0);
  };

  return {
    cnpjInput,
    setCnpjInput,
    isLoading,
    handleCNPJSearch,
    handleCNPJChange,
    userEditingRef,
    inputRef,
    isSearchPending: isSearchPendingRef.current
  };
};
