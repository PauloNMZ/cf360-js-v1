
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { FavorecidoData } from "@/types/favorecido";
import { formatCurrency } from "@/utils/formatting/currencyUtils";
import { cn } from "@/lib/utils";
import { getTipoContaLabel } from "./utils";

interface FavorecidosTableRowProps {
  favorecido: FavorecidoData & { id: string };
  onEdit: (favorecido: FavorecidoData & { id: string }) => void;
  onDelete: (id: string) => void;
  onSelectFavorecido?: (favorecido: FavorecidoData & { id: string }) => void;
  showActions: boolean;
  selectedFavorecidos: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  hidePixColumn: boolean;
  hideBankColumn: boolean;
  hideTipoColumn: boolean;
}

const FavorecidosTableRow: React.FC<FavorecidosTableRowProps> = ({
  favorecido,
  onEdit,
  onDelete,
  onSelectFavorecido,
  showActions,
  selectedFavorecidos,
  onSelectionChange,
  hidePixColumn,
  hideBankColumn,
  hideTipoColumn
}) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Edit button clicked for favorecido:", favorecido.id, favorecido.nome);
    onEdit(favorecido);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Delete button clicked for favorecido ID:", favorecido.id);
    onDelete(favorecido.id);
  };

  const handleSelectFavorecido = (id: string, checked: boolean) => {
    if (onSelectionChange) {
      const newSelection = checked 
        ? [...selectedFavorecidos, id] 
        : selectedFavorecidos.filter(favId => favId !== id);
      onSelectionChange(newSelection);
    }
  };

  return (
    <TableRow
      key={favorecido.id}
      onClick={() => onSelectFavorecido && !showActions && onSelectFavorecido(favorecido)}
      className={cn(
        onSelectFavorecido && !showActions && "cursor-pointer hover:bg-muted/50"
      )}
    >
      {onSelectionChange && (
        <TableCell>
          <Checkbox
            checked={selectedFavorecidos.includes(favorecido.id)}
            onCheckedChange={(checked) => handleSelectFavorecido(favorecido.id, checked as boolean)}
            aria-label={`Selecionar ${favorecido.nome}`}
            onClick={(e) => e.stopPropagation()}
          />
        </TableCell>
      )}
      <TableCell className="font-medium">{favorecido.nome}</TableCell>
      <TableCell>{favorecido.inscricao}</TableCell>
      {!hideBankColumn && (
        <TableCell>
          {favorecido.banco && favorecido.agencia && favorecido.conta
            ? `${favorecido.banco} / ${favorecido.agencia} / ${favorecido.conta}`
            : "-"}
        </TableCell>
      )}
      {!hideTipoColumn && (
        <TableCell>
          {favorecido.tipoConta ? getTipoContaLabel(favorecido.tipoConta) : "-"}
        </TableCell>
      )}
      {!hidePixColumn && (
        <TableCell>
          {favorecido.chavePix
            ? `${favorecido.tipoChavePix}: ${favorecido.chavePix}`
            : "-"}
        </TableCell>
      )}
      <TableCell>{formatCurrency(favorecido.valorPadrao)}</TableCell>
      {showActions && (
        <TableCell>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEditClick}
              className="hover:bg-blue-100 hover:text-blue-600"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDeleteClick}
              className="hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
};

export default FavorecidosTableRow;
