
import { useToast } from "@/hooks/use-toast";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";
import { 
  createConvenente, 
  fetchConvenentes, 
  updateConvenenteData 
} from "@/services/convenente/convenenteService";
import { useRef } from "react";

export const useSaveActions = (
  {
    setFormMode,
    setFormData,
    setConvenentes,
    currentConvenenteId,
    setCurrentConvenenteId,
    setIsLoading
  }: {
    setFormMode: (mode: 'view' | 'create' | 'edit') => void;
    setFormData: (data: ConvenenteData) => void;
    setConvenentes: (convenentes: Array<ConvenenteData & { id: string }>) => void;
    currentConvenenteId: string | null;
    setCurrentConvenenteId: (id: string | null) => void;
    setIsLoading: (loading: boolean) => void;
  }
) => {
  const { toast } = useToast();
  const saveInProgressRef = useRef<boolean>(false);
  const modeChangeInProgressRef = useRef<boolean>(false);

  const handleSave = async (formData: ConvenenteData) => {
    // Prevent re-entrancy
    if (saveInProgressRef.current) {
      console.log("Save already in progress, ignoring duplicate request");
      return;
    }
    
    saveInProgressRef.current = true;
    
    try {
      // Check for CNPJ
      if (!formData.cnpj || formData.cnpj.trim() === '') {
        toast({
          title: "Dados incompletos",
          description: "CNPJ é obrigatório.",
          variant: "destructive",
        });
        return;
      }
      
      // Check for Razão Social
      if (!formData.razaoSocial || formData.razaoSocial.trim() === '') {
        toast({
          title: "Dados incompletos",
          description: "Razão Social é obrigatória.",
          variant: "destructive",
        });
        return;
      }
      
      try {
        console.log("Starting save process with data:", {
          cnpj: formData.cnpj,
          razaoSocial: formData.razaoSocial,
          mode: currentConvenenteId ? 'update' : 'create'
        });
        
        setIsLoading(true);
        
        if (currentConvenenteId === null) {
          // Save new convenente
          console.log("Creating new convenente");
          const savedConvenente = await createConvenente(formData);
          
          toast({
            title: "Convenente salvo",
            description: `${formData.razaoSocial} foi cadastrado com sucesso.`,
          });
          
          // Update convenente list
          const updatedConvenentes = await fetchConvenentes();
          setConvenentes(updatedConvenentes);
          
          // Return to view mode before selecting the new convenente
          setFormMode('view');
          
          // Wait a bit before selecting the new item to avoid loops
          setTimeout(() => {
            // Optional: Select the newly created convenente
            if (savedConvenente && savedConvenente.id) {
              setCurrentConvenenteId(savedConvenente.id);
            }
          }, 300);
          
        } else {
          // Update existing convenente
          console.log("Updating existing convenente:", currentConvenenteId);
          const updatedConvenente = await updateConvenenteData(currentConvenenteId, formData);
          
          if (updatedConvenente) {
            toast({
              title: "Convenente atualizado",
              description: `${formData.razaoSocial} foi atualizado com sucesso.`,
            });
            
            // Update list
            const updatedConvenentes = await fetchConvenentes();
            setConvenentes(updatedConvenentes);
            
            // Return to view mode
            setFormMode('view');
          } else {
            toast({
              title: "Erro ao atualizar",
              description: "Não foi possível atualizar o convenente.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error('Erro ao salvar convenente:', error);
        toast({
          title: "Erro ao salvar",
          description: "Ocorreu um erro ao salvar o convenente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } finally {
      // Release save lock after a delay
      setTimeout(() => {
        saveInProgressRef.current = false;
      }, 800);
    }
  };

  return {
    handleSave
  };
};
