
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";
import { 
  createConvenente, 
  fetchConvenentes, 
  updateConvenenteData, 
  removeConvenente 
} from "@/services/convenente/convenenteService";

export const useIndexPageActions = (
  {
    setFormMode,
    setFormData,
    setFormValid,
    setConvenentes,
    currentConvenenteId,
    setCurrentConvenenteId,
    setIsLoading
  }: {
    setFormMode: (mode: 'view' | 'create' | 'edit') => void;
    setFormData: (data: ConvenenteData) => void;
    setFormValid: (valid: boolean) => void;
    setConvenentes: (convenentes: Array<ConvenenteData & { id: string }>) => void;
    currentConvenenteId: string | null;
    setCurrentConvenenteId: (id: string | null) => void;
    setIsLoading: (loading: boolean) => void;
  }
) => {
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleCreateNew = () => {
    console.log("handleCreateNew called");
    
    // Reset form data to empty object FIRST
    const emptyData = {...emptyConvenente};
    console.log("Setting form data to empty:", emptyData);
    setFormData(emptyData);
    
    // Clear any current selection
    setCurrentConvenenteId(null);
    
    // IMPORTANT: Set form mode to create AFTER resetting data
    // This ensures the form is in create mode when it renders with the empty data
    console.log("Setting formMode to 'create'");
    setFormMode('create');
    
    // Reset form validity
    setFormValid(false);
    
    // Add a delay and log to verify the mode was set correctly
    setTimeout(() => {
      console.log("Checking formMode after timeout: should be 'create'");
    }, 100);
    
    // Show toast to confirm action to user
    toast({
      title: "Modo de inclusão",
      description: "Você está no modo de inclusão de um novo convenente.",
    });
  };

  const handleEdit = () => {
    if (!currentConvenenteId) {
      toast({
        title: "Nenhum convenente selecionado",
        description: "Selecione um convenente da lista para editar.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("handleEdit called, setting formMode to 'edit'");
    setFormMode('edit');
    console.log("Form mode should now be 'edit'");
    setFormValid(true); // Assume the existing data is valid when editing
  };

  const handleDelete = () => {
    if (!currentConvenenteId) {
      toast({
        title: "Nenhum convenente selecionado",
        description: "Selecione um convenente da lista para excluir.",
        variant: "destructive",
      });
      return;
    }
    
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (currentConvenenteId) {
      setIsLoading(true);
      try {
        await removeConvenente(currentConvenenteId);
        
        toast({
          title: "Convenente excluído",
          description: "O convenente foi excluído com sucesso.",
        });
        
        // Update list and close dialog
        const updatedConvenentes = await fetchConvenentes();
        setConvenentes(updatedConvenentes);
        setCurrentConvenenteId(null);
        setFormData({...emptyConvenente});
        setFormMode('view');
      } catch (error) {
        console.error("Erro ao excluir:", error);
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o convenente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    setShowDeleteDialog(false);
  };

  const handleSave = async (formData: ConvenenteData) => {
    try {
      setIsLoading(true);
      
      if (currentConvenenteId === null) {
        // Save new convenente
        await createConvenente(formData);
        
        toast({
          title: "Convenente salvo",
          description: `${formData.razaoSocial} foi cadastrado com sucesso.`,
        });
      } else {
        // Update existing convenente
        const updatedConvenente = await updateConvenenteData(currentConvenenteId, formData);
        
        if (updatedConvenente) {
          toast({
            title: "Convenente atualizado",
            description: `${formData.razaoSocial} foi atualizado com sucesso.`,
          });
        } else {
          toast({
            title: "Erro ao atualizar",
            description: "Não foi possível atualizar o convenente.",
            variant: "destructive",
          });
        }
      }
      
      // Update list
      const updatedConvenentes = await fetchConvenentes();
      setConvenentes(updatedConvenentes);
      
      // Limpar os campos e voltar para modo de visualização
      setFormData({...emptyConvenente});
      setCurrentConvenenteId(null);
      
      // Return to view mode
      console.log("Form saved, returning to view mode");
      setFormMode('view');
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
    showDeleteDialog,
    setShowDeleteDialog,
    handleCreateNew,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleSave
  };
};
