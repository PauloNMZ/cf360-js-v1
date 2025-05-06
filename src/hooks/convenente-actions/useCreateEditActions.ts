
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";

export const useCreateEditActions = (
  {
    setFormMode,
    setFormData,
    setFormValid,
    currentConvenenteId,
    setCurrentConvenenteId,
  }: {
    setFormMode: (mode: 'view' | 'create' | 'edit') => void;
    setFormData: (data: ConvenenteData) => void;
    setFormValid: (valid: boolean) => void;
    currentConvenenteId: string | null;
    setCurrentConvenenteId: (id: string | null) => void;
  }
) => {
  const { toast } = useToast();
  const actionInProgressRef = useRef<boolean>(false);

  const handleCreateNew = () => {
    // Prevent duplicate actions
    if (actionInProgressRef.current) {
      console.log("Create action already in progress, skipping");
      return;
    }
    
    actionInProgressRef.current = true;
    console.log("handleCreateNew called - STARTING CREATE FLOW");
    
    try {
      // First clear any current selection
      setCurrentConvenenteId(null);
      console.log("Current convenente ID cleared");
      
      // Reset form data to empty object
      const emptyData = {...emptyConvenente};
      console.log("Setting form data to empty:", emptyData);
      setFormData(emptyData);
      
      // Reset form validity
      setFormValid(true);
      
      // AFTER data is reset, change the mode
      console.log("Setting formMode to 'create'");
      setFormMode('create');
      
      // Removida a mensagem toast que indicava o modo de inclusão
    } finally {
      // Release action lock after a delay
      setTimeout(() => {
        actionInProgressRef.current = false;
      }, 500);
    }
  };

  const handleEdit = () => {
    // Prevent duplicate actions
    if (actionInProgressRef.current) {
      console.log("Edit action already in progress, skipping");
      return;
    }
    
    actionInProgressRef.current = true;
    
    try {
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
    } finally {
      // Release action lock after a delay
      setTimeout(() => {
        actionInProgressRef.current = false;
      }, 500);
    }
  };

  return {
    handleCreateNew,
    handleEdit
  };
};
