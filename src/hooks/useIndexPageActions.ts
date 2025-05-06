
import { useCreateEditActions } from "./convenente-actions/useCreateEditActions";
import { useDeleteActions } from "./convenente-actions/useDeleteActions";
import { useSaveActions } from "./convenente-actions/useSaveActions";
import { ConvenenteData } from "@/types/convenente";

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
  // Use our smaller hooks
  const createEditActions = useCreateEditActions({
    setFormMode,
    setFormData,
    setFormValid,
    currentConvenenteId,
    setCurrentConvenenteId
  });

  const deleteActions = useDeleteActions({
    setFormMode, 
    setFormData,
    setConvenentes,
    currentConvenenteId,
    setCurrentConvenenteId,
    setIsLoading
  });

  const saveActions = useSaveActions({
    setFormMode,
    setFormData,
    setConvenentes,
    currentConvenenteId,
    setCurrentConvenenteId,
    setIsLoading
  });

  return {
    // Combine all actions from the smaller hooks
    ...createEditActions,
    ...deleteActions,
    ...saveActions
  };
};
