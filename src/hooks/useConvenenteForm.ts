
import { useState, useEffect, useRef, useCallback } from "react";
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
  initialData = {} 
}: UseConvenenteFormProps) => {
  const [formData, setFormData] = useState<ConvenenteData>({...emptyConvenente});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const contactInfoRef = useRef<React.RefObject<ContactInfoSectionRef>>(null);

  const { 
    errors, 
    touched, 
    validateForm,
    markFieldAsTouched,
    setTouched
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
  } = useCNPJSearch(formData, setFormData, setDataLoaded, setTouched, contactInfoRef.current);

  // Function to store the ContactInfoSection ref
  const setContactInfoRef = useCallback((ref: React.RefObject<ContactInfoSectionRef>) => {
    contactInfoRef.current = ref;
  }, []);

  // Initialize form with provided data
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setIsUpdating(true);
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
      setIsUpdating(false);
    }
  }, [initialData, setTouched, setCnpjInput]);

  // Reset form if formMode is 'create'
  useEffect(() => {
    if (formMode === 'create') {
      setFormData({...emptyConvenente});
      setTouched({});
      setDataLoaded(false);
      setCnpjInput('');
    }
  }, [formMode, setCnpjInput]);

  // Validate fields and notify parent component
  useEffect(() => {
    // Skip validation during updates to prevent loops
    if (isUpdating) return;
    
    validateForm(formData);
    
    if (onFormDataChange && (dataLoaded || Object.keys(touched).length > 0)) {
      onFormDataChange(formData);
    }
  }, [formData, dataLoaded, onFormDataChange, validateForm, touched, isUpdating]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
    getPixKeyPlaceholder,
    setContactInfoRef
  };
};
