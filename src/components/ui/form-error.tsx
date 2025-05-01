
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-1.5 text-red-500 text-sm mt-1">
      <AlertCircle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
