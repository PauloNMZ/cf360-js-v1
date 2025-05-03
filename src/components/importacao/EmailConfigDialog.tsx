
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

// Schema for the email form
const emailFormSchema = z.object({
  recipientEmail: z
    .string()
    .email("E-mail inválido")
    .min(1, "E-mail é obrigatório"),
  senderName: z
    .string()
    .min(1, "Nome do remetente é obrigatório"),
  senderDepartment: z
    .string()
    .min(1, "Departamento é obrigatório"),
  remittanceReference: z
    .string()
    .min(1, "Referência da remessa é obrigatória"),
  companyName: z
    .string()
    .min(1, "Nome da empresa é obrigatório"),
  message: z
    .string()
    .min(1, "Mensagem é obrigatória"),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;

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
  // Form initialization with default values
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      recipientEmail: "",
      senderName: "",
      senderDepartment: "",
      remittanceReference: `Remessa de Pagamento - ${reportDate}`,
      companyName: "",
      message: defaultMessage,
    },
  });

  // Handler for form submission
  const handleSubmit = (values: EmailFormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configuração de Envio de E-mail</DialogTitle>
          <DialogDescription>
            Configure os detalhes para o envio do relatório por e-mail.
          </DialogDescription>
        </DialogHeader>

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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Empresa</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nome da Empresa" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Enviar Relatório</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
