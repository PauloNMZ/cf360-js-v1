
import React from "react";
import { FavorecidoData, TipoContaType } from "@/types/favorecido";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/utils/formatting/currencyUtils";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface FavorecidosTableProps {
  favorecidos: Array<FavorecidoData & {
    id: string;
  }>;
  onEdit: (favorecido: FavorecidoData & {
    id: string;
  }) => void;
  onDelete: (id: string) => void;
  onSelectFavorecido?: (favorecido: FavorecidoData & {
    id: string;
  }) => void;
  showActions?: boolean;
  selectedFavorecidos?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  itemsPerPage?: number;
}

const getTipoContaLabel = (tipo: TipoContaType): string => {
  switch (tipo) {
    case "CC":
      return "Conta Corrente";
    case "PP":
      return "Conta Poupança";
    case "TD":
      return "Ted";
    default:
      return tipo;
  }
};

const FavorecidosTable: React.FC<FavorecidosTableProps> = ({
  favorecidos,
  onEdit,
  onDelete,
  onSelectFavorecido,
  showActions = true,
  selectedFavorecidos = [],
  onSelectionChange,
  itemsPerPage = 10
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(itemsPerPage);

  // Debug logs
  console.log("FavorecidosTable - Total favorecidos:", favorecidos.length);
  console.log("FavorecidosTable - Page size:", pageSize);
  const totalPages = pageSize === -1 ? 1 : Math.ceil(favorecidos.length / pageSize);
  const startIndex = pageSize === -1 ? 0 : (currentPage - 1) * pageSize;
  const endIndex = pageSize === -1 ? favorecidos.length : startIndex + pageSize;
  const currentFavorecidos = favorecidos.slice(startIndex, endIndex);
  console.log("FavorecidosTable - Total pages:", totalPages);
  console.log("FavorecidosTable - Current page:", currentPage);
  console.log("FavorecidosTable - Current favorecidos count:", currentFavorecidos.length);

  const handleEditClick = (e: React.MouseEvent, favorecido: FavorecidoData & { id: string }) => {
    e.stopPropagation();
    console.log("Edit button clicked for favorecido:", favorecido.id, favorecido.nome);
    onEdit(favorecido);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    console.log("Delete button clicked for favorecido ID:", id);
    onDelete(id);
  };

  const handleSelectAll = (checked: boolean) => {
    if (onSelectionChange) {
      onSelectionChange(checked ? favorecidos.map(f => f.id) : []);
    }
  };
  const handleSelectFavorecido = (id: string, checked: boolean) => {
    if (onSelectionChange) {
      const newSelection = checked ? [...selectedFavorecidos, id] : selectedFavorecidos.filter(favId => favId !== id);
      onSelectionChange(newSelection);
    }
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top smoothly when page changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="space-y-4">
      {/* Page Size Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Mostrar:</span>
        <Button variant={pageSize === 10 ? "default" : "outline"} size="sm" onClick={() => handlePageSizeChange(10)}>
          10
        </Button>
        <Button variant={pageSize === 25 ? "default" : "outline"} size="sm" onClick={() => handlePageSizeChange(25)}>
          25
        </Button>
        <Button variant={pageSize === 50 ? "default" : "outline"} size="sm" onClick={() => handlePageSizeChange(50)}>
          50
        </Button>
        <Button variant={pageSize === -1 ? "default" : "outline"} size="sm" onClick={() => handlePageSizeChange(-1)}>
          Todos
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {onSelectionChange && (
                  <TableHead className="table-header-checkbox">
                    <Checkbox 
                      checked={selectedFavorecidos.length === favorecidos.length} 
                      onCheckedChange={handleSelectAll} 
                      aria-label="Selecionar todos" 
                    />
                  </TableHead>
                )}
                <TableHead className="table-header-elegant">NOME</TableHead>
                <TableHead className="table-header-elegant">INSCRIÇÃO</TableHead>
                <TableHead className="table-header-elegant">TIPO</TableHead>
                <TableHead className="table-header-elegant">BANCO/AGÊNCIA/CONTA</TableHead>
                <TableHead className="table-header-elegant">TIPO</TableHead>
                <TableHead className="table-header-elegant">CHAVE PIX</TableHead>
                <TableHead className="table-header-elegant">VALOR PADRÃO</TableHead>
                {showActions && (
                  <TableHead className="table-header-actions">AÇÕES</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentFavorecidos.map(favorecido => (
                <TableRow 
                  key={favorecido.id} 
                  onClick={() => onSelectFavorecido && !showActions && onSelectFavorecido(favorecido)} 
                  className={cn(onSelectFavorecido && !showActions && "cursor-pointer hover:bg-muted/50")}
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
                    {favorecido.tipoConta ? getTipoContaLabel(favorecido.tipoConta) : "-"}
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
                          onClick={(e) => handleEditClick(e, favorecido)}
                          className="hover:bg-blue-100 hover:text-blue-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => handleDeleteClick(e, favorecido.id)}
                          className="hover:bg-red-100 hover:text-red-600"
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

      {/* Pagination */}
      {totalPages > 1 && pageSize !== -1 && (
        <div className="flex items-center justify-between px-2 flex-wrap gap-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(endIndex, favorecidos.length)} de {favorecidos.length} registros
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Show All Info */}
      {pageSize === -1 && (
        <div className="text-center text-sm text-muted-foreground">
          Mostrando todos os {favorecidos.length} registros
        </div>
      )}
    </div>
  );
};

export default FavorecidosTable;
