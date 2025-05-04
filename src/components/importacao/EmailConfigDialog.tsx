
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmailForm } from "@/components/importacao/email/EmailForm";
import { EmailFormValues } from "@/types/importacao";

// Props for the EmailConfigDialog component
interface EmailConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMessage: string;
  onSubmit: (values: EmailFormValues) => void;
  reportDate: string;
}

export function EmailConfigDialog({
  isOpen,
  onOpenChange,
  defaultMessage,
  onSubmit,
  reportDate
}: EmailConfigDialogProps) {
  // Get the company name from localStorage if available
  const [companyName, setCompanyName] = useState("");

  // Effect to get company name from localStorage
  useEffect(() => {
    if (isOpen) {
      // Get company name from temporary storage if available
      const storedCompanyName = localStorage.getItem('tempEmailCompanyName');
      if (storedCompanyName) {
        setCompanyName(storedCompanyName);
        // Clear the temporary storage
        localStorage.removeItem('tempEmailCompanyName');
      }
    }
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = (values: EmailFormValues) => {
    // Ensure companyName is included in form values even if field is hidden
    if (companyName && !values.companyName) {
      values.companyName = companyName;
    }
    onSubmit(values);
  };

  // Handle cancel button
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configuração de Envio de E-mail</DialogTitle>
          <DialogDescription>
            Configure os detalhes para o envio do relatório por e-mail.
            O e-mail será enviado usando sua conta de usuário atual.
          </DialogDescription>
        </DialogHeader>

        <EmailForm
          defaultMessage={defaultMessage}
          companyName={companyName}
          reportDate={reportDate}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
