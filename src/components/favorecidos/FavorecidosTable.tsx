
import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { FavorecidosTableProps } from "./types";
import PageSizeSelector from "./PageSizeSelector";
import FavorecidosTableHeader from "./FavorecidosTableHeader";
import FavorecidosTableRow from "./FavorecidosTableRow";
import TablePagination from "./TablePagination";

const FavorecidosTable: React.FC<FavorecidosTableProps> = ({
  favorecidos,
  onEdit,
  onDelete,
  onSelectFavorecido,
  showActions = true,
  selectedFavorecidos = [],
  onSelectionChange,
  itemsPerPage = 10,
  hidePixColumn = false,
  hideBankColumn = false,
  hideTipoColumn = false
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(itemsPerPage);

  console.log("FavorecidosTable - Total favorecidos:", favorecidos.length);
  console.log("FavorecidosTable - Page size:", pageSize);

  const totalPages = pageSize === -1 ? 1 : Math.ceil(favorecidos.length / pageSize);
  const startIndex = pageSize === -1 ? 0 : (currentPage - 1) * pageSize;
  const endIndex = pageSize === -1 ? favorecidos.length : startIndex + pageSize;
  const currentFavorecidos = favorecidos.slice(startIndex, endIndex);

  console.log("FavorecidosTable - Total pages:", totalPages);
  console.log("FavorecidosTable - Current page:", currentPage);
  console.log("FavorecidosTable - Current favorecidos count:", currentFavorecidos.length);

  const handleSelectAll = (checked: boolean) => {
    if (onSelectionChange) {
      onSelectionChange(checked ? favorecidos.map(f => f.id) : []);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
      <PageSizeSelector 
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <FavorecidosTableHeader
              onSelectionChange={onSelectionChange}
              selectedFavorecidos={selectedFavorecidos}
              totalFavorecidos={favorecidos.length}
              showActions={showActions}
              hidePixColumn={hidePixColumn}
              hideBankColumn={hideBankColumn}
              hideTipoColumn={hideTipoColumn}
              onSelectAll={handleSelectAll}
            />
            <TableBody>
              {currentFavorecidos.map(favorecido => (
                <FavorecidosTableRow
                  key={favorecido.id}
                  favorecido={favorecido}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onSelectFavorecido={onSelectFavorecido}
                  showActions={showActions}
                  selectedFavorecidos={selectedFavorecidos}
                  onSelectionChange={onSelectionChange}
                  hidePixColumn={hidePixColumn}
                  hideBankColumn={hideBankColumn}
                  hideTipoColumn={hideTipoColumn}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && pageSize !== -1 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={favorecidos.length}
        />
      )}

      {pageSize === -1 && (
        <div className="text-center text-sm text-muted-foreground">
          Mostrando todos os {favorecidos.length} registros
        </div>
      )}
    </div>
  );
};

export default FavorecidosTable;
