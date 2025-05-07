
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
    
    console.log("Delete action: Opening delete confirmation dialog");
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!currentConvenenteId) {
      console.log("Delete action: No convenente selected, closing dialog");
      setShowDeleteDialog(false);
      return;
    }
    
    try {
      // Flag deletion in progress FIRST, before any other operations
      console.log("Delete action: Setting isDeleting flag to true");
      setIsDeleting(true);
      setIsLoading(true);
      
      console.log("Delete action: Starting deletion process for:", currentConvenenteId);
      
      // Store the ID for use after deletion
      const convenenteIdToDelete = currentConvenenteId;
      
      // Call API to delete the convenente with added timeout for reliability
      console.log("Delete action: Calling API to remove convenente");
      const success = await Promise.race([
        removeConvenente(convenenteIdToDelete),
        new Promise<boolean>((resolve) => {
          // Ensure we give the API enough time to complete
          setTimeout(() => {
            console.log("Delete action: API call timeout reached");
            resolve(false);
          }, 15000); // 15 second timeout
        })
      ]);
      
      console.log("Delete action: API call completed, success:", success);
      
      if (success) {
        console.log("Delete action: Fetching updated convenentes list");
        // Update list after successful deletion
        const updatedConvenentes = await fetchConvenentes();
        console.log("Delete action: Fetched updated convenentes list, count:", updatedConvenentes.length);
        
        // Update state in specific order to avoid UI issues
        console.log("Delete action: Updating application state after successful deletion");
        setConvenentes(updatedConvenentes);
        setCurrentConvenenteId(null);
        setFormData({...emptyConvenente});
        setFormMode('view');
        
        // Show success message after a short delay to ensure UI has updated
        setTimeout(() => {
          toast({
            title: "Convenente excluído",
            description: "O convenente foi excluído com sucesso.",
          });
        }, 100);
      } else {
        throw new Error("Falha ao excluir convenente");
      }
    } catch (error) {
      console.error("Delete action: Error during deletion:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o convenente.",
        variant: "destructive",
      });
    } finally {
      // Sequence of state updates is critical to prevent race conditions
      
      // First clear general loading state
      console.log("Delete action: Clearing isLoading state");
      setIsLoading(false);
      
      // Use setTimeout for reliable state updates in the correct sequence
      setTimeout(() => {
        console.log("Delete action: Clearing isDeleting flag");
        setIsDeleting(false);
        
        // Close the dialog only after ALL operations are complete
        setTimeout(() => {
          console.log("Delete action: Closing delete dialog");
          setShowDeleteDialog(false);
        }, 300);
      }, 500);
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
