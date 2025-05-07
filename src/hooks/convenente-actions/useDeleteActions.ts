
import { useState, useRef } from "react";
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
  
  // Use refs to prevent state update race conditions
  const isDeletingRef = useRef(false);
  const deletionInProgressRef = useRef(false);
  const apiCallCompleteRef = useRef(false);
  
  // Clean up all refs before new deletion attempt
  const resetDeletionState = () => {
    isDeletingRef.current = false;
    deletionInProgressRef.current = false;
    apiCallCompleteRef.current = false;
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
    
    // Reset all deletion state to avoid any previous stale state
    resetDeletionState();
    
    console.log("Delete action: Opening delete confirmation dialog");
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!currentConvenenteId) {
      console.log("Delete action: No convenente selected, closing dialog");
      setShowDeleteDialog(false);
      return;
    }
    
    // Set all flags to indicate deletion is starting
    isDeletingRef.current = true;
    deletionInProgressRef.current = true;
    
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
      const apiPromise = removeConvenente(convenenteIdToDelete);
      
      // Create a timeout promise
      const timeoutPromise = new Promise<boolean>((resolve) => {
        // Ensure we give the API enough time to complete
        setTimeout(() => {
          console.log("Delete action: API call timeout reached");
          if (!apiCallCompleteRef.current) {
            resolve(false);
          }
        }, 20000); // 20 second timeout - increased for reliability
      });
      
      // Race the API call against the timeout
      const success = await Promise.race([
        apiPromise.then(result => {
          apiCallCompleteRef.current = true;
          return result;
        }),
        timeoutPromise
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
        }, 500);
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
      // Flag that deletion process is complete
      deletionInProgressRef.current = false;
      
      // Sequence of state updates is critical to prevent race conditions
      
      // First clear general loading state
      console.log("Delete action: Clearing isLoading state");
      setIsLoading(false);
      
      // Use setTimeout for reliable state updates in the correct sequence
      setTimeout(() => {
        console.log("Delete action: Clearing isDeleting flag");
        setIsDeleting(false);
        isDeletingRef.current = false;
        
        // Close the dialog only after ALL operations are complete
        setTimeout(() => {
          // Only close the dialog if we're not already in a new deletion process
          if (!deletionInProgressRef.current) {
            console.log("Delete action: Closing delete dialog");
            setShowDeleteDialog(false);
          }
        }, 800);
      }, 1000);
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
