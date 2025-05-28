
import React from "react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface StyledFormFieldProps {
  name: string;
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface StyledFormProps {
  title?: string;
  fields: StyledFormFieldProps[];
  onSubmit: (e: React.FormEvent) => void;
  submitText?: string;
  isLoading?: boolean;
  className?: string;
}

const StyledFormField: React.FC<StyledFormFieldProps> = ({
  name,
  label,
  type = "text",
  value,
  placeholder,
  required = false,
  error,
  onChange
}) => {
  return (
    <FormField
      name={name}
      label={label}
      required={required}
      error={error}
      className="space-y-2"
      labelClassName="font-bold text-[#3986FF]"
    >
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={error ? "border-destructive" : ""}
      />
    </FormField>
  );
};

export const StyledForm: React.FC<StyledFormProps> = ({
  title,
  fields,
  onSubmit,
  submitText = "Submit",
  isLoading = false,
  className = ""
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      )}
      
      <form onSubmit={onSubmit} className="space-y-4">
        {fields.map((field) => (
          <StyledFormField
            key={field.name}
            {...field}
          />
        ))}
        
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Loading..." : submitText}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StyledForm;
