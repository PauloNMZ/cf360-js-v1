
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  AlertTriangle,
  ChevronLeft,
  FileOutput,
  Trash2,
  FileCheck,
  Download,
  Search,
  Filter,
} from "lucide-react";
import { TableViewProps, RowData } from "@/types/importacao";
import { formatarValorCurrency } from "@/utils/formatting/currencyUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  hasValidationErrors,
  cnabFileGenerated = false
}: TableViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState<RowData[]>(tableData);
  const [bankFilter, setBankFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const rowsPerPage = 10;

  // Efeito para atualizar dados filtrados quando os dados da tabela mudam
  useEffect(() => {
    applyFilters();
  }, [tableData, bankFilter, searchTerm]);

  // Função para aplicar filtros
  const applyFilters = () => {
    let result = [...tableData];
    
    // Aplicar filtro de banco
    if (bankFilter) {
      result = result.filter(row => 
        row.BANCO.toString().padStart(3, '0').includes(bankFilter)
      );
    }
    
    // Aplicar termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(row => 
        (row.NOME?.toLowerCase().includes(term) || 
         row.INSCRICAO?.toLowerCase().includes(term))
      );
    }
    
    setFilteredData(result);
    setCurrentPage(1); // Reset para a primeira página ao filtrar
  };

  // Lista de bancos única para o filtro
  const uniqueBanks = Array.from(new Set(tableData.map(row => 
    row.BANCO.toString().padStart(3, '0')
  ))).sort();

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const formatarValor = (valor: string | number): string => {
    if (typeof valor === "string") {
      // Remove caracteres não numéricos, exceto ponto e vírgula
      const numericValue = valor.replace(/[^\d.,]/g, "").replace(",", ".");
      return formatarValorCurrency(parseFloat(numericValue));
    }
    return formatarValorCurrency(valor);
  };

  // Calcular total de registros selecionados
  const selectedCount = tableData.filter(row => row.selected).length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => setShowTable(false)}
          className="flex items-center"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Voltar
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleVerifyErrors}
            className="flex items-center"
          >
            <FileCheck className="mr-2 h-4 w-4" />
            Verificar Erros
          </Button>

          {validationPerformed && hasValidationErrors && (
            <Button
              variant="outline"
              onClick={handleExportErrors}
              className="flex items-center text-amber-600"
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar Erros
            </Button>
          )}

          <Button
            onClick={handleProcessSelected}
            className="flex items-center"
          >
            <FileOutput className="mr-2 h-4 w-4" />
            Processar Selecionados
          </Button>
          
          <Button
            onClick={handleGenerateReport}
            className="flex items-center"
            disabled={!cnabFileGenerated}
            title={!cnabFileGenerated ? "Gere o arquivo CNAB antes de visualizar o relatório" : "Gerar relatório PDF dos registros válidos"}
          >
            <FileText className="mr-2 h-4 w-4" />
            Gerar Relatório
          </Button>
        </div>
      </div>

      {/* Área de filtros */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center mb-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por nome ou CPF/CNPJ..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="w-full md:w-[180px]">
          <Select
            value={bankFilter}
            onValueChange={setBankFilter}
          >
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filtrar banco" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os bancos</SelectItem>
              {uniqueBanks.map(bank => (
                <SelectItem key={bank} value={bank}>
                  Banco {bank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>
            Exibindo {currentRows.length} de {filteredData.length} registros |
            Página {currentPage} de {totalPages} | Total Selecionado:{" "}
            {formatarValorCurrency(total)} | Registros selecionados: {selectedCount}
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
              <TableHead>Nome</TableHead>
              <TableHead>Inscrição</TableHead>
              <TableHead>Banco</TableHead>
              <TableHead>Agência</TableHead>
              <TableHead>Conta</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Checkbox
                    checked={row.selected || false}
                    onCheckedChange={(checked) =>
                      handleSelectRow(row.id, !!checked)
                    }
                    aria-label={`Selecionar ${row.NOME}`}
                  />
                </TableCell>
                <TableCell>{row.NOME}</TableCell>
                <TableCell>{row.INSCRICAO}</TableCell>
                <TableCell>{row.BANCO}</TableCell>
                <TableCell>{row.AGENCIA}</TableCell>
                <TableCell>{row.CONTA}</TableCell>
                <TableCell>{row.TIPO}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatarValor(row.VALOR)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteRow(row.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginação simples */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-500">
            Mostrando {startIndex + 1} até {Math.min(endIndex, filteredData.length)}{" "}
            de {filteredData.length} registros
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}
