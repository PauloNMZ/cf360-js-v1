
import { useState, useCallback, useRef, useEffect } from "react";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";
import { useFormValidation } from "./convenente-form/useFormValidation";
import { useCNPJSearch } from "./convenente-form/useCNPJSearch";
import { usePixKeyType } from "./convenente-form/usePixKeyType";
import { UseConvenenteFormProps, FormErrors, PixKeyType } from "./convenente-form/types";
import { formatCNPJ } from "@/utils/formValidation";
import { ContactInfoSectionRef } from "@/components/ConvenenteForm/ContactInfoSection";
import { useFormData } from "./convenente-form/useFormData";
import { useInputHandlers } from "./convenente-form/useInputHandlers";

// Re-export the types
export type { FormErrors, PixKeyType };

export const useConvenenteForm = ({ 
  onFormDataChange, 
  formMode, 
  initialData = {},
  contactInfoRef  // Accept the ref directly
}: UseConvenenteFormProps & { 
  contactInfoRef: React.RefObject<ContactInfoSectionRef> 
}) => {
  const userEditingRef = useRef<boolean>(false);
  const processingChangeRef = useRef<boolean>(false);
  
  // Setup form validation
  const { 
    errors, 
    touched, 
    validateForm,
    markFieldAsTouched,
    setTouched,
    resetErrors,
    resetTouch,
    validationInProgress
  } = useFormValidation();
  
  // Use the form data hook
  const {
    formData,
    setFormData,
    dataLoaded,
    setDataLoaded,
    isUpdating,
    setIsUpdating,
    shouldSkipValidation
  } = useFormData({ initialData, formMode, userEditingRef });
  
  // Use the input handlers hook
  const { handleInputChange, handleBlur } = useInputHandlers({
    setFormData,
    resetErrors,
    markFieldAsTouched,
    setIsUpdating,
    validateForm: () => validateForm(formData)
  });
  
  // Setup PIX key type handling
  const {
    pixKeyType,
    handlePixKeyTypeChange,
    getPixKeyPlaceholder
  } = usePixKeyType();

  // Setup CNPJ search functionality
  const {
    cnpjInput,
    setCnpjInput,
    isLoading,
    handleCNPJSearch,
    handleCNPJChange,
    inputRef,
    isSearchPending
  } = useCNPJSearch(formData, setFormData, setDataLoaded, setTouched, contactInfoRef);

  // Notify parent component when form data changes, with anti-loop protection
  useEffect(() => {
    // Skip validation during updates to prevent loops
    if (isUpdating || shouldSkipValidation || processingChangeRef.current) {
      return;
    }
    
    // Protect against nested calls
    processingChangeRef.current = true;
    
    try {
      validateForm(formData);
      
      if (onFormDataChange && (dataLoaded || Object.keys(touched).length > 0)) {
        // Only notify parent if we have data loaded or user has interacted with form
        onFormDataChange(formData);
      }
    } finally {
      // Release protection after a short delay to prevent immediate re-entry
      setTimeout(() => {
        processingChangeRef.current = false;
      }, 100);
    }
  }, [formData, dataLoaded, onFormDataChange, validateForm, touched, isUpdating, shouldSkipValidation]);

  return {
    cnpjInput,
    formData,
    errors,
    isLoading,
    pixKeyType,
    handleCNPJSearch,
    handleCNPJChange,
    handleInputChange,
    handleBlur,
    handlePixKeyTypeChange,
    getPixKeyPlaceholder,
    inputRef,
    userEditingRef,
    isSearchPending
  };
};
