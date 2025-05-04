
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { EmailFormValues } from "@/types/importacao";
import { getCurrentUserEmail } from "@/services/emailService";

// Schema para o formulário de email - incluindo campo de email do remetente
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
  // Obter o email do usuário atualmente logado
  const [userEmail, setUserEmail] = useState<string>("");
  
  // Efeito para buscar o email do usuário quando o componente é montado
  useEffect(() => {
    const fetchUserEmail = async () => {
      const email = await getCurrentUserEmail();
      setUserEmail(email);
    };
    
    fetchUserEmail();
  }, []);
  
  // Inicialização do formulário com valores padrão
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      recipientEmail: "",
      senderName: "",
      senderEmail: userEmail, // Usar o email do usuário logado
      senderDepartment: "Financeiro", // Departamento padrão como Financeiro
      remittanceReference: `Remessa de Pagamento - ${reportDate}`,
      companyName: companyName,
      message: defaultMessage,
    },
  });

  // Atualizar valores do formulário quando as entradas mudarem
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

  // Atualizar email do remetente quando o email do usuário mudar
  useEffect(() => {
    if (userEmail) {
      form.setValue('senderEmail', userEmail);
    }
  }, [userEmail, form]);

  return { form };
};
