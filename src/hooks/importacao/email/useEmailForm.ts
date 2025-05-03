
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { EmailFormValues } from "@/types/importacao";
import { getCurrentUserEmail } from "@/services/emailService";

// Schema for the email form - updated to include senderEmail field
const emailFormSchema = z.object({
  recipientEmail: z
    .string()
    .email("E-mail inválido")
    .min(1, "E-mail é obrigatório"),
  senderName: z
    .string()
    .min(1, "Nome do remetente é obrigatório"),
  senderEmail: z
    .string()
    .email("E-mail do remetente inválido"),
  senderDepartment: z
    .string()
    .min(1, "Departamento é obrigatório"),
  remittanceReference: z
    .string()
    .min(1, "Referência da remessa é obrigatória"),
  companyName: z.string().optional(),
  message: z
    .string()
    .min(1, "Mensagem é obrigatória"),
});

interface UseEmailFormProps {
  defaultMessage: string;
  companyName: string;
  reportDate: string;
}

export const useEmailForm = ({
  defaultMessage,
  companyName,
  reportDate
}: UseEmailFormProps) => {
  // Get the current user's email
  const userEmail = getCurrentUserEmail();
  
  // Form initialization with default values
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      recipientEmail: "",
      senderName: "",
      senderEmail: userEmail, // Usar o email do usuário logado
      senderDepartment: "Financeiro", // Set default department as Financeiro
      remittanceReference: `Remessa de Pagamento - ${reportDate}`,
      companyName: companyName,
      message: defaultMessage,
    },
  });

  // Update form values when inputs change
  useEffect(() => {
    if (companyName) {
      form.setValue('companyName', companyName);
    }
  }, [companyName, form]);

  useEffect(() => {
    if (defaultMessage) {
      form.setValue('message', defaultMessage);
    }
  }, [defaultMessage, form]);

  useEffect(() => {
    if (reportDate) {
      form.setValue('remittanceReference', `Remessa de Pagamento - ${reportDate}`);
    }
  }, [reportDate, form]);

  return { form };
};
