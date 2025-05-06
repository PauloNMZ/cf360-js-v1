
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
  
  // Track if we've already applied initial data to prevent loops
  const initialDataAppliedRef = useRef(false);
  const formModeChangeTimeRef = useRef<number>(0);
  const lastInitialDataRef = useRef<string>("");

  // Add an effect to track form mode changes for debugging
  useEffect(() => {
    if (formMode !== lastFormMode) {
      console.log(`Form mode changed from ${lastFormMode} to ${formMode}`);
      setLastFormMode(formMode);
      
      // Track when the form mode changed
      formModeChangeTimeRef.current = Date.now();
      
      // Reset the initialDataApplied flag when switching to create mode
      if (formMode === 'create') {
        initialDataAppliedRef.current = false;
        lastInitialDataRef.current = "";
      }
    }
  }, [formMode, lastFormMode]);

  // Initialize form with provided data - with safeguards against loops
  useEffect(() => {
    // Skip if we've recently changed form modes (within past 500ms)
    if (Date.now() - formModeChangeTimeRef.current < 500) {
      console.log("Skipping initialData effect due to recent form mode change");
      return;
    }
    
    const hasInitialData = initialData && Object.keys(initialData || {}).length > 0;
    
    // Create a fingerprint of the initial data to detect changes
    const dataFingerprint = hasInitialData ? JSON.stringify(initialData) : "";
    
    // Check if this is the same data we've already processed
    if (dataFingerprint === lastInitialDataRef.current && initialDataAppliedRef.current) {
      console.log("Same initial data detected, preventing loop");
      return;
    }
    
    console.log("useFormData: initialData effect running", { 
      hasInitialData,
      formMode,
      isUserEditing: userEditingRef.current,
      dataAlreadyApplied: initialDataAppliedRef.current
    });
    
    // Skip if user is actively editing a field (prevents data reset during typing)
    if (userEditingRef && userEditingRef.current) {
      console.log("Skipping initialData effect as user is actively editing");
      return;
    }
    
    if (hasInitialData) {
      setIsUpdating(true);
      setShouldSkipValidation(true);
      
      try {
        console.log("Setting form data from initialData:", initialData);
        setFormData(prev => ({
          ...prev,
          ...initialData
        }));
        
        // Update our tracking refs
        setDataLoaded(true);
        initialDataAppliedRef.current = true;
        lastInitialDataRef.current = dataFingerprint;
      } finally {
        setIsUpdating(false);
        // Give a short delay before re-enabling validation
        setTimeout(() => setShouldSkipValidation(false), 200);
      }
    }
  }, [initialData, userEditingRef, formMode]);

  // Reset form if formMode changes to 'create'
  useEffect(() => {
    if (formMode === 'create' && lastFormMode !== 'create') {
      console.log("Resetting form for create mode");
      
      // Only reset if user is not actively editing
      if (!userEditingRef.current) {
        setFormData({...emptyConvenente});
        setDataLoaded(false);
        initialDataAppliedRef.current = false;
        lastInitialDataRef.current = "";
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
