
import React from "react";
import { FavorecidoData } from "@/types/favorecido";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { formatCurrency } from "@/utils/formatting/currencyUtils";

interface FavorecidosTableProps {
  favorecidos: Array<FavorecidoData & { id: string }>;
  onEdit: (favorecido: FavorecidoData & { id: string }) => void;
  onDelete: (id: string) => void;
}

const FavorecidosTable: React.FC<FavorecidosTableProps> = ({
  favorecidos,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Inscrição</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Banco/Agência/Conta</TableHead>
            <TableHead>Chave PIX</TableHead>
            <TableHead>Valor Padrão</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {favorecidos.map((favorecido) => (
            <TableRow key={favorecido.id}>
              <TableCell className="font-medium">{favorecido.nome}</TableCell>
              <TableCell>{favorecido.inscricao}</TableCell>
              <TableCell>{favorecido.tipoInscricao}</TableCell>
              <TableCell>
                {favorecido.banco && favorecido.agencia && favorecido.conta
                  ? `${favorecido.banco} / ${favorecido.agencia} / ${favorecido.conta}`
                  : "-"
                }
              </TableCell>
              <TableCell>
                {favorecido.chavePix 
                  ? `${favorecido.tipoChavePix}: ${favorecido.chavePix}` 
                  : "-"
                }
              </TableCell>
              <TableCell>{formatCurrency(favorecido.valorPadrao)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(favorecido)}
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(favorecido.id!)}
                    title="Excluir"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FavorecidosTable;
