
import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RowData, TableViewProps } from "@/types/importacao";
import { AlertCircle, ArrowLeft, Trash2 } from "lucide-react";

export function TableView({
  handleSelectAll,
  selectAll,
  tableData,
  handleSelectRow,
  handleDeleteRow,
  handleProcessSelected,
  handleVerifyErrors,
  total,
  setShowTable
}: TableViewProps) {
  // Count selected rows
  const selectedCount = tableData.filter(row => row.selected).length;
  
  // Format currency value for display
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setShowTable(false)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <Button variant="outline" onClick={handleVerifyErrors}>
            <AlertCircle className="mr-2 h-4 w-4" /> Verificar Erros
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">
              {selectedCount} de {tableData.length} registros selecionados
            </div>
            <div className="font-bold">
              Total: {formatCurrency(total)}
            </div>
          </div>
          <Button onClick={handleProcessSelected} disabled={selectedCount === 0}>
            Processar Selecionados
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Inscrição</TableHead>
              <TableHead>Banco</TableHead>
              <TableHead>Agência</TableHead>
              <TableHead>Conta</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="w-[50px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row: RowData) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Checkbox
                    checked={row.selected}
                    onCheckedChange={(checked) => handleSelectRow(row.id, !!checked)}
                  />
                </TableCell>
                <TableCell>{row.NOME}</TableCell>
                <TableCell>{row.INSCRICAO}</TableCell>
                <TableCell>{row.BANCO}</TableCell>
                <TableCell>{row.AGENCIA}</TableCell>
                <TableCell>{row.CONTA}</TableCell>
                <TableCell>{row.TIPO}</TableCell>
                <TableCell>
                  {typeof row.VALOR === 'number' 
                    ? formatCurrency(row.VALOR)
                    : formatCurrency(parseFloat(row.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.')))}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteRow(row.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
