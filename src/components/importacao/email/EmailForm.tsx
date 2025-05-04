
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EmailFormValues } from "@/types/importacao";
import { useEmailForm } from "@/hooks/importacao/email/useEmailForm";

interface EmailFormProps {
  defaultMessage: string;
  companyName: string;
  reportDate: string;
  onSubmit: (values: EmailFormValues) => void;
  onCancel: () => void;
}

export function EmailForm({
  defaultMessage,
  companyName,
  reportDate,
  onSubmit,
  onCancel
}: EmailFormProps) {
  const { form, userEmail } = useEmailForm({
    defaultMessage,
    companyName,
    reportDate
  });

  // Handler de envio personalizado para garantir que o email do usuário logado seja usado
  const handleSubmit = (values: EmailFormValues) => {
    // Garantir que o email do remetente seja o email do usuário logado
    values.senderEmail = userEmail;
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="recipientEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail do Destinatário</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="diretor.financeiro@empresa.com" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="senderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Remetente</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Seu Nome" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="senderDepartment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Financeiro" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="remittanceReference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Referência da Remessa</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Company name is hidden as it's automatically determined */}
          <input type="hidden" name="companyName" value={companyName} />

          {/* Email do remetente é mantido como campo oculto */}
          <input type="hidden" name="senderEmail" value={userEmail} />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensagem</FormLabel>
                <FormControl>
                  <Textarea 
                    className="min-h-[200px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button type="submit">Enviar Relatório</Button>
        </div>
      </form>
    </Form>
  );
}
