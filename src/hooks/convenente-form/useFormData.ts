
import { useState, useEffect, useRef } from "react";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";
import { formatCNPJ } from "@/utils/formValidation";

interface UseFormDataProps {
  initialData?: Partial<ConvenenteData>;
  formMode: 'view' | 'create' | 'edit';
  userEditingRef: React.MutableRefObject<boolean>;
}

export const useFormData = ({ initialData, formMode, userEditingRef }: UseFormDataProps) => {
  const [formData, setFormData] = useState<ConvenenteData>({...emptyConvenente});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [shouldSkipValidation, setShouldSkipValidation] = useState(false);
  const [lastFormMode, setLastFormMode] = useState<'view' | 'create' | 'edit'>(formMode);

  // Add an effect to track form mode changes for debugging
  useEffect(() => {
    if (formMode !== lastFormMode) {
      console.log(`useFormData: formMode changed from ${lastFormMode} to ${formMode}`);
      setLastFormMode(formMode);
    }
  }, [formMode, lastFormMode]);

  // Initialize form with provided data
  useEffect(() => {
    console.log("useFormData: initialData effect running", { 
      hasInitialData: Object.keys(initialData || {}).length > 0,
      formMode,
      isUserEditing: userEditingRef.current
    });
    
    // Skip if user is actively editing a field (prevents data reset during typing)
    if (userEditingRef && userEditingRef.current) {
      console.log("Skipping initialData effect as user is actively editing");
      return;
    }
    
    if (initialData && Object.keys(initialData).length > 0) {
      setIsUpdating(true);
      setShouldSkipValidation(true);
      
      try {
        console.log("Setting form data from initialData:", initialData);
        setFormData(prev => ({
          ...prev,
          ...initialData
        }));
        
        setDataLoaded(true);
      } finally {
        setIsUpdating(false);
        // Give a short delay before re-enabling validation
        setTimeout(() => setShouldSkipValidation(false), 100);
      }
    }
  }, [initialData, userEditingRef]);

  // Reset form if formMode is 'create'
  useEffect(() => {
    if (formMode === 'create' && lastFormMode !== 'create') {
      console.log("useFormData: Resetting form for create mode");
      
      // Only reset if user is not actively editing
      if (!userEditingRef.current) {
        setFormData({...emptyConvenente});
        setDataLoaded(false);
      } else {
        console.log("Skipping form reset as user is actively editing");
      }
    }
  }, [formMode, lastFormMode, userEditingRef]);

  return {
    formData,
    setFormData,
    dataLoaded,
    setDataLoaded,
    isUpdating,
    setIsUpdating,
    shouldSkipValidation,
    setShouldSkipValidation,
    lastFormMode
  };
};
