
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
  
  // Setup form validation
  const { 
    errors, 
    touched, 
    validateForm,
    markFieldAsTouched,
    setTouched,
    resetErrors,
    resetTouch
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

  // Notify parent component when form data changes
  useEffect(() => {
    // Skip validation during updates to prevent loops
    if (isUpdating || shouldSkipValidation) {
      return;
    }
    
    validateForm(formData, isUpdating);
    
    if (onFormDataChange && (dataLoaded || Object.keys(touched).length > 0)) {
      console.log("Calling onFormDataChange with current data:", {
        cnpj: formData.cnpj,
        razaoSocial: formData.razaoSocial,
      });
      onFormDataChange(formData);
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
