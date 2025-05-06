
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
    setFormMode('create');
    setFormValid(false); // Reset form validity when creating new
    setCurrentConvenenteId(null);
    setFormData({...emptyConvenente});
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
    
    setFormMode('edit');
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
