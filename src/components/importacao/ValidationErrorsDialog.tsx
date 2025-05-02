
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ErrorRecord } from '@/types/cnab240';
import { formatarCpfCnpj } from '@/utils/cnabUtils';

interface ValidationErrorsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  errors: ErrorRecord[];
}

export function ValidationErrorsDialog({ isOpen, onOpenChange, errors }: ValidationErrorsDialogProps) {
  if (errors.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Erros de Validação</DialogTitle>
          <DialogDescription>
            Foram encontrados {errors.length} registros com erros de validação.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[500px] w-full rounded-md border p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Favorecido</TableHead>
                <TableHead className="w-[120px]">Inscrição</TableHead>
                <TableHead className="w-[100px]">Banco/Agência/Conta</TableHead>
                <TableHead>Erros</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {errors.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.favorecido.nome}</TableCell>
                  <TableCell>{formatarCpfCnpj(record.favorecido.inscricao)}</TableCell>
                  <TableCell>
                    {record.favorecido.banco}/{record.favorecido.agencia}/{record.favorecido.conta}
                  </TableCell>
                  <TableCell>
                    <ul className="list-disc pl-5">
                      {record.errors.map((error, index) => (
                        <li key={index} className="text-red-500">
                          {error.message}
                          {error.expectedValue && error.actualValue && (
                            <span className="block text-xs text-gray-500">
                              Valor esperado: {error.expectedValue}, valor informado: {error.actualValue}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
