
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface FavorecidosTableHeaderProps {
  onSelectionChange?: (selectedIds: string[]) => void;
  selectedFavorecidos: string[];
  totalFavorecidos: number;
  showActions: boolean;
  hidePixColumn: boolean;
  hideBankColumn: boolean;
  hideTipoColumn: boolean;
  onSelectAll: (checked: boolean) => void;
}

const FavorecidosTableHeader: React.FC<FavorecidosTableHeaderProps> = ({
  onSelectionChange,
  selectedFavorecidos,
  totalFavorecidos,
  showActions,
  hidePixColumn,
  hideBankColumn,
  hideTipoColumn,
  onSelectAll
}) => {
  return (
    <TableHeader>
      <TableRow>
        {onSelectionChange && (
          <TableHead className="table-header-checkbox">
            <Checkbox
              checked={selectedFavorecidos.length === totalFavorecidos}
              onCheckedChange={onSelectAll}
              aria-label="Selecionar todos"
            />
          </TableHead>
        )}
        <TableHead className="table-header-elegant">NOME</TableHead>
        <TableHead className="table-header-elegant">INSCRIÇÃO</TableHead>
        {!hideBankColumn && (
          <TableHead className="table-header-elegant">BANCO/AGÊNCIA/CONTA</TableHead>
        )}
        {!hideTipoColumn && (
          <TableHead className="table-header-elegant">TIPO</TableHead>
        )}
        {!hidePixColumn && (
          <TableHead className="table-header-elegant">CHAVE PIX</TableHead>
        )}
        <TableHead className="table-header-elegant">VALOR PADRÃO</TableHead>
        {showActions && (
          <TableHead className="table-header-actions">AÇÕES</TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
};

export default FavorecidosTableHeader;
