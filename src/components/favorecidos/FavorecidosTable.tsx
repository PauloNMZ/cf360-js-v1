
import React from "react";
import { FavorecidoData } from "@/types/favorecido";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/utils/formatting/currencyUtils";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface FavorecidosTableProps {
  favorecidos: Array<FavorecidoData & { id: string }>;
  onEdit: (favorecido: FavorecidoData & { id: string }) => void;
  onDelete: (id: string) => void;
  onSelectFavorecido?: (favorecido: FavorecidoData & { id: string }) => void;
  showActions?: boolean;
  selectedFavorecidos?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  itemsPerPage?: number;
}

const FavorecidosTable: React.FC<FavorecidosTableProps> = ({
  favorecidos,
  onEdit,
  onDelete,
  onSelectFavorecido,
  showActions = true,
  selectedFavorecidos = [],
  onSelectionChange,
  itemsPerPage = 10,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(favorecidos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFavorecidos = favorecidos.slice(startIndex, endIndex);

  const handleSelectAll = (checked: boolean) => {
    if (onSelectionChange) {
      onSelectionChange(checked ? favorecidos.map(f => f.id) : []);
    }
  };

  const handleSelectFavorecido = (id: string, checked: boolean) => {
    if (onSelectionChange) {
      const newSelection = checked
        ? [...selectedFavorecidos, id]
        : selectedFavorecidos.filter(favId => favId !== id);
      onSelectionChange(newSelection);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {onSelectionChange && (
                  <TableHead className="w-[50px] font-semibold">
                    <Checkbox
                      checked={selectedFavorecidos.length === favorecidos.length}
                      onCheckedChange={handleSelectAll}
                      aria-label="Selecionar todos"
                    />
                  </TableHead>
                )}
                <TableHead className="font-semibold">Nome</TableHead>
                <TableHead className="font-semibold">Inscrição</TableHead>
                <TableHead className="font-semibold">Tipo</TableHead>
                <TableHead className="font-semibold">Banco/Agência/Conta</TableHead>
                <TableHead className="font-semibold">Chave PIX</TableHead>
                <TableHead className="font-semibold">Valor Padrão</TableHead>
                {showActions && <TableHead className="w-[100px] font-semibold">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentFavorecidos.map((favorecido) => (
                <TableRow
                  key={favorecido.id}
                  onClick={() => onSelectFavorecido && !showActions && onSelectFavorecido(favorecido)}
                  className={cn(
                    onSelectFavorecido && !showActions && "cursor-pointer hover:bg-muted/50",
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
                  {showActions && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(favorecido)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(favorecido.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(endIndex, favorecidos.length)} de {favorecidos.length} registros
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-8 h-8"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavorecidosTable;
