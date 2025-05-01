
import { useState } from "react";
import { validateCNPJ, validateEmail, validatePhone } from "@/utils/formValidation";
import { FormErrors } from "./types";
import { ConvenenteData } from "@/types/convenente";

export const useFormValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateForm = (formData: ConvenenteData) => {
    const newErrors: FormErrors = {};
    
    // Validate CNPJ
    if (touched.cnpj && formData.cnpj && !validateCNPJ(formData.cnpj)) {
      newErrors.cnpj = "CNPJ inválido";
    }
    
    // Validate required fields
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
  };

  const markFieldAsTouched = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  const markMultipleFieldsAsTouched = (fields: Record<string, boolean>) => {
    setTouched(prev => ({ ...prev, ...fields }));
  };

  return {
    errors,
    touched,
    validateForm,
    markFieldAsTouched,
    markMultipleFieldsAsTouched,
    setTouched
  };
};
