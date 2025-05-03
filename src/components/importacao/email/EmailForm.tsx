
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

// Schema for the email form - company name is optional and hidden
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
    .email("E-mail do remetente inválido")
    .min(1, "E-mail do remetente é obrigatório"),
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              name="senderEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail do Remetente</FormLabel>
                  <FormControl>
                    <Input
                      readOnly 
                      {...field}
                      className="bg-gray-50" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
