
import React, { useState, useEffect } from 'react';
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
import { ArrowLeft, Download, Filter, Trash2, FileText, Mail } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationFirst,
  PaginationLast,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TableView({
  handleSelectAll,
  selectAll,
  tableData,
  handleSelectRow,
  handleDeleteRow,
  handleProcessSelected,
  handleVerifyErrors,
  handleExportErrors,
  handleGenerateReport,
  total,
  setShowTable,
  validationPerformed,
  hasValidationErrors
}: TableViewProps) {
  // Estado para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState<RowData[]>([]);
  const [bankFilter, setBankFilter] = useState<string>("todos");

  // Calcular o total de páginas
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  
  // Filtragem e paginação dos dados
  useEffect(() => {
    let result = [...tableData];
    
    // Aplicar filtro de banco
    if (bankFilter === "bb") {
      result = result.filter(row => {
        const bankCode = row.BANCO.toString().trim().padStart(3, '0');
        return bankCode === "001";
      });
    } else if (bankFilter === "outros") {
      result = result.filter(row => {
        const bankCode = row.BANCO.toString().trim().padStart(3, '0');
        return bankCode !== "001";
      });
    }
    
    setFilteredData(result);
    setCurrentPage(1); // Reset para primeira página ao filtrar
  }, [tableData, bankFilter]);

  // Dados da página atual
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  // Count selected rows
  const selectedCount = tableData.filter(row => row.selected).length;
  
  // Format currency value for display
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Navegação entre páginas
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Gerando números de página para exibição
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setShowTable(false)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          {validationPerformed && hasValidationErrors && (
            <Button 
              variant="destructive" 
              onClick={handleExportErrors}
              className="animate-pulse border-2 border-red-500"
            >
              <Download className="mr-2 h-4 w-4" /> Exportar Erros
            </Button>
          )}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" /> Filtrar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 bg-white">
              <DropdownMenuRadioGroup value={bankFilter} onValueChange={setBankFilter}>
                <DropdownMenuRadioItem value="todos">Todos os bancos</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="bb">Banco do Brasil</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="outros">Outras IF</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            onClick={handleGenerateReport} 
            disabled={selectedCount === 0}
            className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
          >
            <FileText className="mr-2 h-4 w-4" /> Gerar Relatório
          </Button>
          
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
            {getCurrentPageData().map((row: RowData) => (
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
      
      {/* Paginação */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Linhas por página:</span>
          <select 
            className="border rounded p-1 text-sm"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            {[5, 10, 25, 50].map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
        
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationFirst 
                onClick={() => goToPage(1)} 
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            <PaginationItem>
              <PaginationPrevious
                onClick={() => goToPage(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {getPageNumbers().map(page => (
              <PaginationItem key={page}>
                <PaginationLink 
                  isActive={currentPage === page} 
                  onClick={() => goToPage(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            {totalPages > getPageNumbers()[getPageNumbers().length - 1] && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => goToPage(currentPage + 1)} 
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            <PaginationItem>
              <PaginationLast 
                onClick={() => goToPage(totalPages)} 
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        
        <div className="text-sm text-gray-500">
          {filteredData.length > 0 ? 
            `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, filteredData.length)} de ${filteredData.length}` : 
            "0-0 de 0"}
        </div>
      </div>
    </div>
  );
}
