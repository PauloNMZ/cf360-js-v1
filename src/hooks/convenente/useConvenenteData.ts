import { useState, useEffect, useCallback } from "react";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";
import { getConvenentes, getConvenenteById } from "@/services/convenente/convenenteApi";
import { useToast } from "@/hooks/use-toast";

export const useConvenenteData = () => {
  const { toast } = useToast();
  
  // Form and data states
  const [formData, setFormData] = useState<ConvenenteData>({...emptyConvenente});
  const [formValid, setFormValid] = useState(false);
  const [convenentes, setConvenentes] = useState<Array<ConvenenteData & { id: string }>>([]);
  const [currentConvenenteId, setCurrentConvenenteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load convenentes when modal is opened only once
  const loadConvenenteData = async (isOpen: boolean) => {
    if (isOpen && !dataLoaded) {
      setIsLoading(true);
      try {
        const loadedConvenentes = await getConvenentes();
        setConvenentes(loadedConvenentes);
        setDataLoaded(true);
      } catch (error) {
        console.error("Erro ao carregar convenentes:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Ocorreu um erro ao buscar os convenentes.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Reset data when needed
  const resetFormData = () => {
    setFormData({...emptyConvenente});
    setCurrentConvenenteId(null);
    setFormValid(false);
    setDataLoaded(false);
  };

  const handleSelectConvenente = useCallback(async (convenente: ConvenenteData & { id: string }, formMode: 'view' | 'create' | 'edit') => {
    console.log('handleSelectConvenente - convenente:', convenente);
    console.log('handleSelectConvenente - formMode:', formMode);
    
    // First set the mode back to view
    setCurrentConvenenteId(convenente.id);
    console.log('handleSelectConvenente - currentConvenenteId set to:', convenente.id);
    
    try {
      setIsLoading(true);
      // Get complete convenente from database only if not in edit mode
      // For edit mode, use the data we already have
      setFormData(convenente);
      console.log('handleSelectConvenente - formData set to:', convenente);
      
      // Only fetch if additional data is needed and not in edit mode
      if (formMode !== 'edit') {
        const completeConvenente = await getConvenenteById(convenente.id);
        console.log('handleSelectConvenente - completeConvenente:', completeConvenente);
        if (completeConvenente) {
          setFormData(completeConvenente);
          console.log('handleSelectConvenente - formData updated with completeConvenente:', completeConvenente);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar detalhes do convenente:", error);
      toast({
        title: "Erro ao carregar detalhes",
        description: "Não foi possível carregar os detalhes do convenente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleFormDataChange = useCallback((data: ConvenenteData) => {
    console.log("Form data changing:", data.cnpj); // Debugging
    setFormData(data);
    
    // Check if required fields are filled
    const requiredFields = ['cnpj', 'razaoSocial'];
    const hasRequiredFields = requiredFields.every(field => data[field] && data[field].toString().trim() !== '');
    setFormValid(hasRequiredFields);
  }, []);

  return {
    formData,
    setFormData,
    formValid,
    setFormValid,
    convenentes,
    setConvenentes,
    currentConvenenteId,
    setCurrentConvenenteId,
    isLoading,
    setIsLoading,
    dataLoaded, 
    setDataLoaded,
    loadConvenenteData,
    resetFormData,
    handleSelectConvenente,
    handleFormDataChange
  };
};
