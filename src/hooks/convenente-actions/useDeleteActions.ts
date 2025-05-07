
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
      // Set deletion state first to block UI
      setIsDeleting(true);
      console.log("Starting deletion process for:", currentConvenenteId);
      
      // Store the ID for use after deletion
      const convenenteIdToDelete = currentConvenenteId;
      
      // Call API to delete the convenente
      const success = await removeConvenente(convenenteIdToDelete);
      console.log("Delete API call completed, success:", success);
      
      if (success) {
        // Update list after successful deletion
        const updatedConvenentes = await fetchConvenentes();
        console.log("Fetched updated convenente list, count:", updatedConvenentes.length);
        
        // Update state
        setConvenentes(updatedConvenentes);
        setCurrentConvenenteId(null);
        setFormData({...emptyConvenente});
        setFormMode('view');
        
        toast({
          title: "Convenente excluído",
          description: "O convenente foi excluído com sucesso.",
        });
      } else {
        throw new Error("Falha ao excluir convenente");
      }
    } catch (error) {
      console.error("Error during deletion:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o convenente.",
        variant: "destructive",
      });
    } finally {
      // Only close the dialog after all operations are completed
      // This sequence is critical - first, complete all operations
      // Then update loading state
      setIsLoading(false);
      
      // Finally update deletion state and dialog state with a small delay
      // to ensure React has processed the other state updates first
      setTimeout(() => {
        setIsDeleting(false);
        setShowDeleteDialog(false);
      }, 100);
    }
  };

  return {
    showDeleteDialog,
    setShowDeleteDialog,
    handleDelete,
    confirmDelete,
    isDeleting,
    setIsDeleting
  };
};
