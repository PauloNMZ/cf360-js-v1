
import { formatPhone } from "@/utils/formValidation";
import { ConvenenteData } from "@/types/convenente";

interface UseInputHandlersProps {
  setFormData: React.Dispatch<React.SetStateAction<ConvenenteData>>;
  resetErrors: (name?: string) => void;
  markFieldAsTouched: (name: string) => void;
  setIsUpdating: (isUpdating: boolean) => void;
  validateForm: (formData: ConvenenteData) => boolean;
}

export const useInputHandlers = ({
  setFormData,
  resetErrors,
  markFieldAsTouched,
  setIsUpdating,
  validateForm
}: UseInputHandlersProps) => {
  
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
    validateForm(null);
  };

  return {
    handleInputChange,
    handleBlur
  };
};
