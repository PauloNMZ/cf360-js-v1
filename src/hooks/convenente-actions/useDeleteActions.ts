
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
  const deleteInProgressRef = useRef(false);
  
  // Reset all state tracking variables
  const resetDeletionState = useCallback(() => {
    console.log("Delete action: Resetting deletion state");
    isDeletingRef.current = false;
    deleteInProgressRef.current = false;
    setIsDeleting(false);
    setIsLoading(false);
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
    
    // Prevent opening dialog if deletion is already in progress
    if (isDeletingRef.current || deleteInProgressRef.current) {
      console.log("Delete action: Already deleting or in progress, ignoring click");
      return;
    }
    
    console.log("Delete action: Opening delete confirmation dialog for ID:", currentConvenenteId);
    setShowDeleteDialog(true);
  }, [currentConvenenteId, toast]);

  const confirmDelete = useCallback(async () => {
    // Prevent multiple confirmations
    if (isDeletingRef.current || deleteInProgressRef.current) {
      console.log("Delete action: Already in progress, ignoring confirmation");
      return;
    }
    
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
    deleteInProgressRef.current = true;
    setIsDeleting(true);
    setIsLoading(true);
    
    try {
      console.log("Delete action: Calling API to remove convenente");
      
      // Execute the deletion API call
      const success = await removeConvenente(idToDelete as string);
      
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
        
        // Close the dialog first
        setShowDeleteDialog(false);
        
        // Reset deletion state only after dialog is closed
        setTimeout(() => {
          isDeletingRef.current = false;
          deleteInProgressRef.current = false;
          setIsDeleting(false);
          setIsLoading(false);
        }, 500);
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
      
      // Reset deletion state
      isDeletingRef.current = false;
      deleteInProgressRef.current = false;
      setIsDeleting(false);
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  }, [currentConvenenteId, setConvenentes, setCurrentConvenenteId, setFormData, setFormMode, setIsLoading, toast]);

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
