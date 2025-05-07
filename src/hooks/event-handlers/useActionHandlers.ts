
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { ConvenenteData } from "@/types/convenente";

export const useActionHandlers = ({
  indexPage,
  indexPageActions,
  isDeleting
}: {
  indexPage: any;
  indexPageActions: any;
  isDeleting: boolean;
}) => {
  const { toast } = useToast();
  const actionInProgressRef = useRef(false);
  const saveActionInProgressRef = useRef(false);

  // Helper to prevent actions during unstable states
  const isActionAllowed = () => {
    if (isDeleting || actionInProgressRef.current) {
      console.log("Action blocked: Operation in progress");
      return false;
    }
    return true;
  };

  // Function to save current form data with anti-loop protection
  const handleSaveClick = () => {
    // Prevent multiple save attempts or during deletion
    if (isDeleting || saveActionInProgressRef.current) {
      console.log("Save action blocked: Operation in progress");
      return;
    }

    saveActionInProgressRef.current = true;
    
    try {
      if (!indexPage.formData.cnpj || indexPage.formData.cnpj.trim() === '') {
        toast({
          title: "Dados incompletos",
          description: "CNPJ é obrigatório.",
          variant: "destructive",
        });
        return;
      }
      
      if (!indexPage.formData.razaoSocial || indexPage.formData.razaoSocial.trim() === '') {
        toast({
          title: "Dados incompletos",
          description: "Razão Social é obrigatória.",
          variant: "destructive",
        });
        return;
      }
      
      // Clone the form data to prevent any reference issues
      const dataToSave = {...indexPage.formData};
      console.log("Iniciando salvamento com dados:", dataToSave);
      
      // Use custom action to handle save
      indexPageActions.handleSave(dataToSave);
    } finally {
      // Release the save action lock after a delay
      setTimeout(() => {
        saveActionInProgressRef.current = false;
      }, 500);
    }
  };

  return {
    isActionAllowed,
    handleSaveClick,
    actionInProgressRef
  };
};
