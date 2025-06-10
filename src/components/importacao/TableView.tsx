import React, { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { TableViewProps, RowData } from "@/types/importacao";
import { formatarValorCurrency } from "@/utils/formatting/currencyUtils";
import { formatCPFCNPJ } from "@/utils/formatting/stringUtils";
import { ReportSortDialog } from "./ReportSortDialog";
import { ReportSortType } from "@/types/reportSorting";
import ImportacaoSearchBar from "./ImportacaoSearchBar";
import TableViewHeader from "./TableViewHeader";
import TableViewPagination from "./TableViewPagination";

export function TableView({
  handleSelectAll,
  selectAll,
  tableData,
  handleSelectRow,
  handleDeleteRow,
  handleEditRow,
  handleProcessSelected,
  handleClearSelection,
  selectedCount,
  handleVerifyErrors,
  handleExportErrors,
  handleGenerateReport,
  total,
  setShowTable,
  validationPerformed,
  hasValidationErrors,
  cnabFileGenerated = false
}: TableViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showSortDialog, setShowSortDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data based on search term
  const filteredData = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return tableData;
    }
    const term = searchTerm.toLowerCase().trim();
    return tableData.filter(row => {
      const nome = row.NOME?.toLowerCase() || '';
      const inscricao = row.INSCRICAO?.toString().toLowerCase() || '';
      return nome.includes(term) || inscricao.includes(term);
    });
  }, [tableData, searchTerm]);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const formatarValor = (valor: string | number): string => {
    if (typeof valor === "string") {
      const numericValue = valor.replace(/[^\d.,]/g, "").replace(",", ".");
      return formatarValorCurrency(parseFloat(numericValue));
    }
    return formatarValorCurrency(valor);
  };
  const formatarInscricao = (inscricao: string): string => {
    if (!inscricao) return "";
    return formatCPFCNPJ(inscricao);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };
  const handleVerifyErrorsClick = () => {
    console.log("TableView - Botão Verificar Erros clicado");
    if (handleVerifyErrors) {
      handleVerifyErrors();
    }
  };
  const handleProcessSelectedClick = () => {
    console.log("TableView - Botão Processar Selecionados clicado");
    if (handleProcessSelected) {
      handleProcessSelected();
    }
  };
  const handleGenerateReportClick = () => {
    console.log("=== DEBUG TableView - handleGenerateReportClick ===");
    if (!cnabFileGenerated) {
      console.error("TableView - CNAB não foi gerado ainda");
      return;
    }
    setShowSortDialog(true);
  };
  const handleSortConfirm = (sortType: ReportSortType) => {
    console.log("=== DEBUG TableView - handleSortConfirm ===");
    if (handleGenerateReport) {
      handleGenerateReport(sortType);
    }
  };
  const handleClearSelectionClick = () => {
    console.log("TableView - Botão Limpar Seleção clicado");
    if (handleClearSelection) {
      handleClearSelection();
    }
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const handleEditClick = (rowId: number) => {
    console.log("TableView - Botão Editar clicado para ID:", rowId);
    if (handleEditRow) {
      handleEditRow(rowId);
    }
  };

  const handleDeleteClick = (rowId: number) => {
    console.log("TableView - Botão Deletar clicado para ID:", rowId);
    if (handleDeleteRow) {
      handleDeleteRow(rowId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <TableViewHeader 
        selectedCount={selectedCount} 
        validationPerformed={validationPerformed} 
        hasValidationErrors={hasValidationErrors} 
        cnabFileGenerated={cnabFileGenerated} 
        onBack={() => setShowTable(false)} 
        onVerifyErrors={handleVerifyErrorsClick} 
        onExportErrors={handleExportErrors} 
        onClearSelection={handleClearSelectionClick} 
        onProcessSelected={handleProcessSelectedClick} 
        onGenerateReport={handleGenerateReportClick} 
      />

      {/* Search bar */}
      <ImportacaoSearchBar 
        searchTerm={searchTerm} 
        onSearchChange={handleSearchChange} 
        hasResults={filteredData.length > 0} 
        resultCount={filteredData.length} 
      />

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableCaption>
            Exibindo {currentRows.length} de {filteredData.length} registros |
            Página {currentPage} de {totalPages} | Total Selecionado:{" "}
            {formatarValorCurrency(total)}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={selectAll} 
                  onCheckedChange={handleSelectAll} 
                  aria-label="Selecionar todos os registros" 
                />
              </TableHead>
              <TableHead>Nome do Favorecido</TableHead>
              <TableHead className="text-right">Inscrição</TableHead>
              <TableHead className="text-center">Banco</TableHead>
              <TableHead className="text-center">Agência</TableHead>
              <TableHead className="text-right">Conta</TableHead>
              <TableHead className="text-center">Tipo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.map(row => (
              <TableRow key={row.id}>
                <TableCell>
                  <Checkbox 
                    checked={row.selected || false} 
                    onCheckedChange={(checked) => handleSelectRow(row.id, !!checked)} 
                    aria-label={`Selecionar ${row.NOME}`} 
                  />
                </TableCell>
                <TableCell>{row.NOME}</TableCell>
                <TableCell className="text-right font-mono">{formatarInscricao(row.INSCRICAO)}</TableCell>
                <TableCell className="text-center">{row.BANCO}</TableCell>
                <TableCell className="text-center">{row.AGENCIA}</TableCell>
                <TableCell className="text-right">{row.CONTA}</TableCell>
                <TableCell className="text-center">{row.TIPO}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatarValor(row.VALOR)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditClick(row.id)} 
                      className="hover:bg-blue-100 hover:text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleDeleteClick(row.id)} 
                      className="hover:bg-red-100 dark:hover:bg-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <TableViewPagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        rowsPerPage={rowsPerPage} 
        totalItems={filteredData.length} 
        startIndex={startIndex} 
        endIndex={endIndex} 
        onPageChange={handlePageChange} 
        onRowsPerPageChange={handleRowsPerPageChange} 
      />

      {/* Sort dialog */}
      <ReportSortDialog 
        isOpen={showSortDialog} 
        onOpenChange={setShowSortDialog} 
        onConfirm={handleSortConfirm} 
        defaultSortType={ReportSortType.BY_NAME} 
      />
    </div>
  );
}
