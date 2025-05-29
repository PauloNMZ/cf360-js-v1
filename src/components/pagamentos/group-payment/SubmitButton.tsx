
import React from 'react';
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  disabled: boolean;
}

const SubmitButton = ({ isLoading, disabled }: SubmitButtonProps) => {
  return (
    <div className="flex justify-end pt-4">
      <Button 
        type="submit" 
        disabled={disabled}
        className="flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Processando...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Criar Lançamento por Grupo
          </>
        )}
      </Button>
    </div>
  );
};

export default SubmitButton;
