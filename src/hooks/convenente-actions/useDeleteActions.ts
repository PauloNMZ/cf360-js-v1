
import { useState, useRef, useCallback } from "react";
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
  
  // Track deletion state with refs to avoid stale closures
  const isDeletingRef = useRef(false);
  const currentIdRef = useRef<string | null>(null);
  const apiCallCompleteRef = useRef(false);
  
  // Reset all state tracking variables
  const resetDeletionState = useCallback(() => {
    console.log("Delete action: Resetting deletion state");
    isDeletingRef.current = false;
    apiCallCompleteRef.current = false;
    setIsDeleting(false);
    setIsLoading(false);
  }, [setIsLoading]);

  // Clean reset function to ensure proper application state after deletion
  const performCleanStateReset = useCallback(() => {
    // First reset the UI loading states
    setIsLoading(false);
    setIsDeleting(false);
    
    // Then reset deletion tracking refs
    isDeletingRef.current = false;
    apiCallCompleteRef.current = false;
    
    // Finally close dialog and reset ID refs
    setShowDeleteDialog(false);
    currentIdRef.current = null;
  }, [setIsLoading]);

  const handleDelete = useCallback(() => {
    if (!currentConvenenteId) {
      toast({
        title: "Nenhum convenente selecionado",
        description: "Selecione um convenente da lista para excluir.",
        variant: "destructive",
      });
      return;
    }
    
    // Store the current ID in ref for use throughout the deletion process
    currentIdRef.current = currentConvenenteId;
    
    console.log("Delete action: Opening delete confirmation dialog for ID:", currentConvenenteId);
    setShowDeleteDialog(true);
  }, [currentConvenenteId, toast]);

  const confirmDelete = useCallback(async () => {
    if (!currentIdRef.current && !currentConvenenteId) {
      console.log("Delete action: No convenente ID found, aborting deletion");
      setShowDeleteDialog(false);
      return;
    }
    
    // Use the ID from ref or current state
    const idToDelete = currentIdRef.current || currentConvenenteId;
    console.log("Delete action: Starting deletion for ID:", idToDelete);
    
    // Set deletion flags first to prevent UI interaction
    isDeletingRef.current = true;
    setIsDeleting(true);
    setIsLoading(true);
    
    try {
      console.log("Delete action: Calling API to remove convenente");
      
      // Create a timeout promise to handle API timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          if (!apiCallCompleteRef.current) {
            reject(new Error("API call timeout"));
          }
        }, 30000); // 30 second timeout
      });
      
      // Execute the deletion API call
      const apiPromise = removeConvenente(idToDelete as string)
        .then(result => {
          apiCallCompleteRef.current = true;
          return result;
        });
      
      // Race the promises - whichever completes first
      const success = await Promise.race([apiPromise, timeoutPromise])
        .catch(error => {
          console.error("Delete action: API error:", error);
          return false;
        });
      
      console.log("Delete action: API call completed, success:", success);
      
      if (success) {
        // After successful deletion, get updated list
        console.log("Delete action: Fetching updated convenentes list");
        const updatedConvenentes = await fetchConvenentes()
          .catch(error => {
            console.error("Delete action: Error fetching updated list:", error);
            return [];
          });
        
        console.log("Delete action: Updating application state after deletion");
        
        // Update state in specific sequence - IMPORTANT: this order matters!
        setConvenentes(updatedConvenentes);
        setCurrentConvenenteId(null);
        setFormData({...emptyConvenente});
        setFormMode('view');
        
        // Show success message
        toast({
          title: "Convenente excluído",
          description: "O convenente foi excluído com sucesso.",
        });
        
        // Clean reset after a short delay to ensure state updates are processed
        setTimeout(() => {
          performCleanStateReset();
        }, 300);
      } else {
        throw new Error("Falha ao excluir convenente");
      }
    } catch (error) {
      console.error("Delete action: Error during deletion:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o convenente. Por favor, tente novamente.",
        variant: "destructive",
      });
      
      // Even in case of error, we need to reset state properly
      performCleanStateReset();
    }
  }, [currentConvenenteId, setConvenentes, setCurrentConvenenteId, setFormData, setFormMode, setIsLoading, toast, performCleanStateReset]);

  return {
    showDeleteDialog,
    setShowDeleteDialog,
    handleDelete,
    confirmDelete,
    isDeleting,
    setIsDeleting,
    resetDeletionState
  };
};
