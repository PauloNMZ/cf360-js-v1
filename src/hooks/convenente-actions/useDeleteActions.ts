
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";
import { removeConvenente, fetchConvenentes } from "@/services/convenente/convenenteService";

export const useDeleteActions = (
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    if (!currentConvenenteId) {
      setShowDeleteDialog(false);
      return;
    }
    
    try {
      // Set deletion status FIRST before any other operations
      setIsDeleting(true);
      setIsLoading(true);
      
      console.log("Iniciando exclusão do convenente:", currentConvenenteId);
      const convenenteIdToDelete = currentConvenenteId; // Store ID for later use
      
      const success = await removeConvenente(convenenteIdToDelete);
      
      if (success) {
        console.log("Convenente excluído com sucesso");
        
        // Update list after successful deletion
        const updatedConvenentes = await fetchConvenentes();
        console.log("Lista atualizada:", updatedConvenentes.length, "convenentes");
        
        // Update state in proper sequence
        setConvenentes(updatedConvenentes);
        setCurrentConvenenteId(null);
        setFormData({...emptyConvenente});
        setFormMode('view');
        
        toast({
          title: "Convenente excluído",
          description: "O convenente foi excluído com sucesso.",
        });
        
        console.log("Operação concluída para convenente:", convenenteIdToDelete);
      } else {
        throw new Error("Falha ao excluir convenente");
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o convenente.",
        variant: "destructive",
      });
    } finally {
      // IMPORTANT: Only update these states after all other operations are complete
      // and only close the dialog at the very end
      setIsLoading(false);
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return {
    showDeleteDialog,
    setShowDeleteDialog,
    handleDelete,
    confirmDelete,
    isDeleting
  };
};
