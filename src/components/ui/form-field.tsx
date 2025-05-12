
import React from "react";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/ui/form-error";

interface FormFieldProps {
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  labelClassName?: string;
  children: React.ReactNode;
}

export const FormField = ({
  name,
  label,
  required = false,
  error,
  className = "",
  labelClassName = "",
  children
}: FormFieldProps) => {
  return (
    <div className={className}>
      <Label 
        htmlFor={name} 
        className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
      >
        {label}{required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {error && <FormError message={error} />}
    </div>
  );
};
