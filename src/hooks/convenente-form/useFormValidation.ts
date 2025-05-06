
import { useState } from "react";
import { validateCNPJ, validateEmail, validatePhone } from "@/utils/formValidation";
import { FormErrors } from "./types";
import { ConvenenteData } from "@/types/convenente";

export const useFormValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [validationInProgress, setValidationInProgress] = useState(false);

  const validateForm = (formData: ConvenenteData, isUpdating = false) => {
    // Skip validation if it's already in progress or during updates
    if (validationInProgress || isUpdating) {
      console.log("Skipping validation - in progress or during update");
      return true;
    }

    setValidationInProgress(true);
    
    try {
      const newErrors: FormErrors = {};
      
      // Validate CNPJ
      if (touched.cnpj && formData.cnpj && !validateCNPJ(formData.cnpj)) {
        newErrors.cnpj = "CNPJ inválido";
      }
      
      // Validate required fields - only if touched AND no value
      if (touched.razaoSocial && (!formData.razaoSocial || formData.razaoSocial.trim() === '')) {
        newErrors.razaoSocial = "Razão social é obrigatória";
      }
      
      // Validate email
      if (touched.email && formData.email && !validateEmail(formData.email)) {
        newErrors.email = "Email inválido";
      }
      
      // Validate phone
      if (touched.fone && formData.fone && !validatePhone(formData.fone)) {
        newErrors.fone = "Telefone inválido";
      }
      
      // Validate cell phone
      if (touched.celular && formData.celular && !validatePhone(formData.celular)) {
        newErrors.celular = "Celular inválido";
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    } finally {
      setValidationInProgress(false);
    }
  };

  const markFieldAsTouched = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  const markMultipleFieldsAsTouched = (fields: Record<string, boolean>) => {
    setTouched(prev => ({ ...prev, ...fields }));
  };

  const resetErrors = (fieldName?: string) => {
    if (fieldName) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    } else {
      setErrors({});
    }
  };

  const resetTouch = (fieldName?: string) => {
    if (fieldName) {
      setTouched(prev => ({ ...prev, [fieldName]: false }));
    } else {
      setTouched({});
    }
  };

  return {
    errors,
    touched,
    validateForm,
    markFieldAsTouched,
    markMultipleFieldsAsTouched,
    setTouched,
    resetErrors,
    resetTouch,
    validationInProgress
  };
};
