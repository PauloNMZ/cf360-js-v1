
import { useState } from "react";
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

  const handleCreateNew = () => {
    console.log("handleCreateNew called - STARTING CREATE FLOW");
    
    // First set the mode to create - this ensures the form knows it should accept new input
    console.log("Setting formMode to 'create'");
    setFormMode('create');
    
    // Short delay to ensure mode change propagates
    setTimeout(() => {
      // Clear any current selection AFTER mode change
      setCurrentConvenenteId(null);
      console.log("Current convenente ID cleared");
      
      // Reset form data to empty object AFTER mode change
      const emptyData = {...emptyConvenente};
      console.log("Setting form data to empty:", emptyData);
      setFormData(emptyData);
      
      // Reset form validity
      setFormValid(false);
      
      // Add a delay and log to verify the mode was set correctly
      setTimeout(() => {
        console.log("VERIFICATION: Form mode should now be 'create'");
      }, 100);
      
      // Show toast to confirm action to user
      toast({
        title: "Modo de inclusão",
        description: "Você está no modo de inclusão de um novo convenente.",
      });
    }, 50);
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

  return {
    handleCreateNew,
    handleEdit
  };
};
