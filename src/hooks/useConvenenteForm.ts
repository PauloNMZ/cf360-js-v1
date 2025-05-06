
import { useState, useEffect, useCallback } from "react";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";
import { useFormValidation } from "./convenente-form/useFormValidation";
import { useCNPJSearch } from "./convenente-form/useCNPJSearch";
import { usePixKeyType } from "./convenente-form/usePixKeyType";
import { UseConvenenteFormProps, FormErrors, PixKeyType } from "./convenente-form/types";
import { formatCNPJ } from "@/utils/formValidation";
import { ContactInfoSectionRef } from "@/components/ConvenenteForm/ContactInfoSection";

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
  const [formData, setFormData] = useState<ConvenenteData>({...emptyConvenente});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [shouldSkipValidation, setShouldSkipValidation] = useState(false);

  const { 
    errors, 
    touched, 
    validateForm,
    markFieldAsTouched,
    setTouched,
    resetErrors,
    resetTouch
  } = useFormValidation();
  
  const {
    pixKeyType,
    handlePixKeyTypeChange,
    getPixKeyPlaceholder
  } = usePixKeyType();

  const {
    cnpjInput,
    setCnpjInput,
    isLoading,
    handleCNPJSearch,
    handleCNPJChange
  } = useCNPJSearch(formData, setFormData, setDataLoaded, setTouched, contactInfoRef);

  // Initialize form with provided data
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setIsUpdating(true);
      setShouldSkipValidation(true);
      
      try {
        setFormData(prev => ({
          ...prev,
          ...initialData
        }));

        // Ensure CNPJ input field is populated for editing
        if (initialData.cnpj) {
          setCnpjInput(formatCNPJ(initialData.cnpj));
        }
        
        // Mark fields as touched when there's initial data
        if (initialData.razaoSocial) {
          setTouched(prev => ({
            ...prev,
            razaoSocial: true
          }));
        }

        setDataLoaded(true);
      } finally {
        setIsUpdating(false);
        // Give a short delay before re-enabling validation
        setTimeout(() => setShouldSkipValidation(false), 100);
      }
    }
  }, [initialData, setTouched, setCnpjInput]);

  // Reset form if formMode is 'create'
  useEffect(() => {
    if (formMode === 'create') {
      setFormData({...emptyConvenente});
      resetTouch();
      resetErrors();
      setDataLoaded(false);
      setCnpjInput('');
    }
  }, [formMode, setCnpjInput, resetTouch, resetErrors]);

  // Validate fields and notify parent component
  useEffect(() => {
    // Skip validation during updates to prevent loops
    if (isUpdating || shouldSkipValidation) {
      console.log("Skipping validation due to update or explicit skip flag");
      return;
    }
    
    validateForm(formData, isUpdating);
    
    if (onFormDataChange && (dataLoaded || Object.keys(touched).length > 0)) {
      onFormDataChange(formData);
    }
  }, [formData, dataLoaded, onFormDataChange, validateForm, touched, isUpdating, shouldSkipValidation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear any previous error for this field as user is fixing it
    resetErrors(name);
    markFieldAsTouched(name);
    
    setIsUpdating(true);
    // Apply specific formatting depending on the field
    if (name === 'fone' || name === 'celular') {
      setFormData(prev => ({
        ...prev,
        [name]: formatPhone(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setIsUpdating(false);
    
    // Debug log
    console.log(`Campo ${name} alterado para: ${value}`);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    markFieldAsTouched(name);
    validateForm(formData);
  };

  // Helper function to avoid circular dependencies
  const formatPhone = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      if (cleaned.length <= 10) {
        return cleaned
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2')
          .replace(/(-\d{4})\d+?$/, '$1');
      } else {
        return cleaned
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2')
          .replace(/(-\d{4})\d+?$/, '$1');
      }
    }
    return cleaned.substring(0, 11);
  };

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
    getPixKeyPlaceholder
  };
};
