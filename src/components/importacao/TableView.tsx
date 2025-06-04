
import React, { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FileText, AlertTriangle, ChevronLeft, FileOutput, Trash2, FileCheck, Download, X } from "lucide-react";
import { TableViewProps, RowData } from "@/types/importacao";
import { formatarValorCurrency } from "@/utils/formatting/currencyUtils";
import { formatCPFCNPJ } from "@/utils/formatting/stringUtils";

export function TableView({
  handleSelectAll,
  selectAll,
  tableData,
  handleSelectRow,
  handleDeleteRow,
  handleProcessSelected,
  handleClearSelection, // NOVO: Função para limpar seleção
  selectedCount, // NOVO: Contagem de registros selecionados
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
  const rowsPerPage = 10;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = tableData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  
  const formatarValor = (valor: string | number): string => {
    if (typeof valor === "string") {
      // Remove caracteres não numéricos, exceto ponto e vírgula
      const numericValue = valor.replace(/[^\d.,]/g, "").replace(",", ".");
      return formatarValorCurrency(parseFloat(numericValue));
    }
    return formatarValorCurrency(valor);
  };

  // Função para formatar CPF/CNPJ com máscara
  const formatarInscricao = (inscricao: string): string => {
    if (!inscricao) return "";
    return formatCPFCNPJ(inscricao);
  };

  // Adicionar logs de debugging para os botões
  const handleVerifyErrorsClick = () => {
    console.log("TableView - Botão Verificar Erros clicado");
    console.log("TableView - tableData length:", tableData.length);
    console.log("TableView - handleVerifyErrors function:", typeof handleVerifyErrors);
    if (handleVerifyErrors) {
      handleVerifyErrors();
    } else {
      console.error("TableView - handleVerifyErrors não está definido");
    }
  };

  const handleProcessSelectedClick = () => {
    console.log("TableView - Botão Processar Selecionados clicado");
    console.log("TableView - tableData length:", tableData.length);
    console.log("TableView - selected rows:", selectedCount);
    console.log("TableView - handleProcessSelected function:", typeof handleProcessSelected);
    if (handleProcessSelected) {
      handleProcessSelected();
    } else {
      console.error("TableView - handleProcessSelected não está definido");
    }
  };

  const handleGenerateReportClick = () => {
    console.log("TableView - Botão Gerar Relatório clicado");
    console.log("TableView - cnabFileGenerated:", cnabFileGenerated);
    console.log("TableView - handleGenerateReport function:", typeof handleGenerateReport);
    if (handleGenerateReport) {
      handleGenerateReport();
    } else {
      console.error("TableView - handleGenerateReport não está definido");
    }
  };

  // NOVO: Handler para limpar seleção
  const handleClearSelectionClick = () => {
    console.log("TableView - Botão Limpar Seleção clicado");
    if (handleClearSelection) {
      handleClearSelection();
    } else {
      console.error("TableView - handleClearSelection não está definido");
    }
  };
  
  return <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => setShowTable(false)} className="flex items-center">
          <ChevronLeft className="mr-1 h-4 w-4" /> Voltar
        </Button>

        <div className="flex gap-2 items-center">
          {/* NOVO: Mostrar contador de selecionados */}
          {selectedCount > 0 && (
            <span className="text-sm text-muted-foreground bg-blue-50 px-3 py-1 rounded-md">
              {selectedCount} registro{selectedCount !== 1 ? 's' : ''} selecionado{selectedCount !== 1 ? 's' : ''}
            </span>
          )}

          <Button variant="outline" onClick={handleVerifyErrorsClick} className="flex items-center">
            <FileCheck className="mr-2 h-4 w-4" />
            Verificar Erros
          </Button>

          {validationPerformed && hasValidationErrors && <Button variant="outline" onClick={handleExportErrors} className="flex items-center text-amber-600">
              <Download className="mr-2 h-4 w-4" />
              Exportar Erros
            </Button>}

          {/* NOVO: Botão Limpar Seleção - só aparece quando há itens selecionados */}
          {selectedCount > 0 && (
            <Button 
              variant="outline" 
              onClick={handleClearSelectionClick} 
              className="flex items-center text-gray-600"
            >
              <X className="mr-2 h-4 w-4" />
              Limpar Seleção
            </Button>
          )}

          {/* ATUALIZADO: Botão Processar Selecionados agora fica desabilitado quando não há seleção */}
          <Button 
            onClick={handleProcessSelectedClick} 
            className="flex items-center" 
            disabled={selectedCount === 0}
            title={selectedCount === 0 ? "Selecione pelo menos um registro para processar" : `Processar ${selectedCount} registro${selectedCount !== 1 ? 's' : ''} selecionado${selectedCount !== 1 ? 's' : ''}`}
          >
            <FileOutput className="mr-2 h-4 w-4" />
            Processar Selecionados
          </Button>
          
          <Button onClick={handleGenerateReportClick} className="flex items-center" disabled={!cnabFileGenerated} title={!cnabFileGenerated ? "Gere o arquivo CNAB antes de visualizar o relatório" : "Gerar relatório PDF dos registros válidos"}>
            <FileText className="mr-2 h-4 w-4" />
            Gerar Relatório
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>
            Exibindo {currentRows.length} de {tableData.length} registros |
            Página {currentPage} de {totalPages} | Total Selecionado:{" "}
            {formatarValorCurrency(total)}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} aria-label="Selecionar todos os registros" />
              </TableHead>
              <TableHead>Nome do Favorecido</TableHead>
              <TableHead className="text-right">Inscrição</TableHead>
              <TableHead className="text-center">Banco</TableHead>
              <TableHead className="text-center">Agência</TableHead>
              <TableHead className="text-right">Conta</TableHead>
              <TableHead className="text-center">Tipo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.map(row => <TableRow key={row.id}>
                <TableCell>
                  <Checkbox checked={row.selected || false} onCheckedChange={checked => handleSelectRow(row.id, !!checked)} aria-label={`Selecionar ${row.NOME}`} />
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
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteRow(row.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>

      {/* Paginação simples */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-500">
            Mostrando {startIndex + 1} até {Math.min(endIndex, tableData.length)}{" "}
            de {tableData.length} registros
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Anterior
          </Button>
          <Button variant="outline" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            Próximo
          </Button>
        </div>
      </div>
    </div>;
}
