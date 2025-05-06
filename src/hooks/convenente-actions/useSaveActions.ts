
import { useToast } from "@/hooks/use-toast";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";
import { 
  createConvenente, 
  fetchConvenentes, 
  updateConvenenteData 
} from "@/services/convenente/convenenteService";

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

  const handleSave = async (formData: ConvenenteData) => {
    console.log("handleSave chamado com dados:", formData);
    
    // Check for CNPJ
    if (!formData.cnpj || formData.cnpj.trim() === '') {
      console.log("Erro de validação: CNPJ vazio");
      toast({
        title: "Dados incompletos",
        description: "CNPJ é obrigatório.",
        variant: "destructive",
      });
      return;
    }
    
    // Check for Razão Social
    if (!formData.razaoSocial || formData.razaoSocial.trim() === '') {
      console.log("Erro de validação: Razão Social vazia");
      toast({
        title: "Dados incompletos",
        description: "Razão Social é obrigatória.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("Iniciando processo de salvamento:", formData);
      setIsLoading(true);
      
      if (currentConvenenteId === null) {
        // Save new convenente
        console.log("Criando novo convenente:", formData);
        const savedConvenente = await createConvenente(formData);
        console.log("Convenente salvo com sucesso:", savedConvenente);
        
        toast({
          title: "Convenente salvo",
          description: `${formData.razaoSocial} foi cadastrado com sucesso.`,
        });
        
        // Update convenente list
        const updatedConvenentes = await fetchConvenentes();
        setConvenentes(updatedConvenentes);
        
        // Optional: Select the newly created convenente
        if (savedConvenente && savedConvenente.id) {
          setCurrentConvenenteId(savedConvenente.id);
        }
      } else {
        // Update existing convenente
        console.log("Atualizando convenente existente:", currentConvenenteId, formData);
        const updatedConvenente = await updateConvenenteData(currentConvenenteId, formData);
        console.log("Convenente atualizado com sucesso:", updatedConvenente);
        
        if (updatedConvenente) {
          toast({
            title: "Convenente atualizado",
            description: `${formData.razaoSocial} foi atualizado com sucesso.`,
          });
          
          // Update list
          const updatedConvenentes = await fetchConvenentes();
          setConvenentes(updatedConvenentes);
        } else {
          toast({
            title: "Erro ao atualizar",
            description: "Não foi possível atualizar o convenente.",
            variant: "destructive",
          });
        }
      }
      
      // Return to view mode - delay this slightly to prevent race conditions
      setTimeout(() => {
        console.log("Form saved, returning to view mode");
        setFormMode('view');
        
        // Only clear form data after mode change
        setTimeout(() => {
          if (currentConvenenteId === null) {
            setFormData({...emptyConvenente});
          }
        }, 50);
      }, 100);
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
  };

  return {
    handleSave
  };
};
