
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatting/currencyUtils";

interface DataTableColumn {
  id: string;
  title: string;
  type: string;
  bank: string;
  pixKey: string;
  defaultAmount: number;
  actions: string;
}

interface DataTableProps {
  data: DataTableColumn[];
  itemsPerPage?: number;
  showAllOption?: boolean;
}

const validateData = (item: DataTableColumn): boolean => {
  // Check if id is numerical
  if (typeof item.id !== 'string' || isNaN(Number(item.id))) {
    return false;
  }
  
  // Check if defaultAmount is numerical
  if (typeof item.defaultAmount !== 'number' || isNaN(item.defaultAmount)) {
    return false;
  }
  
  // Check if title and bank are strings
  if (typeof item.title !== 'string' || typeof item.bank !== 'string') {
    return false;
  }
  
  // Check if required fields are not empty
  if (!item.title.trim() || !item.bank.trim()) {
    return false;
  }
  
  return true;
};

const DataTable: React.FC<DataTableProps> = ({
  data,
  itemsPerPage = 10,
  showAllOption = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(itemsPerPage);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Validate data and track errors
  useEffect(() => {
    const errors: string[] = [];
    data.forEach((item, index) => {
      if (!validateData(item)) {
        errors.push(`Row ${index + 1}: Invalid data`);
      }
    });
    setValidationErrors(errors);
  }, [data]);

  // Filter valid data
  const validData = data.filter(validateData);
  const hasInvalidData = validationErrors.length > 0;

  // Pagination logic
  const totalPages = pageSize === -1 ? 1 : Math.ceil(validData.length / pageSize);
  const startIndex = pageSize === -1 ? 0 : (currentPage - 1) * pageSize;
  const endIndex = pageSize === -1 ? validData.length : startIndex + pageSize;
  const currentData = validData.slice(startIndex, endIndex);

  // Scroll to top when page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        <p>Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Error Messages */}
      {hasInvalidData && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <h4 className="font-semibold">Invalid data</h4>
          </div>
          <div className="mt-2 space-y-1">
            {validationErrors.map((error, index) => (
              <p key={index} className="text-sm text-destructive">
                {error}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Page Size Controls */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Mostrar:</span>
        <Button
          variant={pageSize === 10 ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageSizeChange(10)}
        >
          10
        </Button>
        <Button
          variant={pageSize === 25 ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageSizeChange(25)}
        >
          25
        </Button>
        <Button
          variant={pageSize === 50 ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageSizeChange(50)}
        >
          50
        </Button>
        {showAllOption && (
          <Button
            variant={pageSize === -1 ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageSizeChange(-1)}
          >
            Todos
          </Button>
        )}
      </div>

      {/* Data Table */}
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#ECF2FF] dark:bg-secondary hover:bg-[#ECF2FF] dark:hover:bg-secondary">
                <TableHead className="font-bold text-primary bg-[#ECF2FF] dark:bg-secondary">ID</TableHead>
                <TableHead className="font-bold text-primary bg-[#ECF2FF] dark:bg-secondary">Título</TableHead>
                <TableHead className="font-bold text-primary bg-[#ECF2FF] dark:bg-secondary">Tipo</TableHead>
                <TableHead className="font-bold text-primary bg-[#ECF2FF] dark:bg-secondary">Banco</TableHead>
                <TableHead className="font-bold text-primary bg-[#ECF2FF] dark:bg-secondary">Chave PIX</TableHead>
                <TableHead className="font-bold text-primary bg-[#ECF2FF] dark:bg-secondary">Valor Padrão</TableHead>
                <TableHead className="font-bold text-primary bg-[#ECF2FF] dark:bg-secondary">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item, index) => (
                <TableRow
                  key={`${item.id}-${index}`}
                  className="hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.bank}</TableCell>
                  <TableCell>{item.pixKey || "-"}</TableCell>
                  <TableCell>{formatCurrency(item.defaultAmount)}</TableCell>
                  <TableCell>{item.actions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && pageSize !== -1 && (
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(endIndex, validData.length)} de {validData.length} registros válidos
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

      {/* Show All Info */}
      {pageSize === -1 && (
        <div className="text-center text-sm text-muted-foreground">
          Mostrando todos os {validData.length} registros válidos
        </div>
      )}
    </div>
  );
};

export default DataTable;
