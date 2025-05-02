
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EXPECTED_HEADERS, TableViewProps } from '@/types/importacao';

const TableView: React.FC<TableViewProps> = ({
  handleSelectAll,
  selectAll,
  tableData,
  handleSelectRow,
  handleDeleteRow,
  handleProcessSelected,
  total,
  setShowTable
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Dados Importados</h2>
        <Button 
          onClick={() => setShowTable(false)}
          variant="outline"
        >
          Voltar
        </Button>
      </div>
      
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="select-all" 
              checked={selectAll} 
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all" className="text-sm font-medium">
              Selecionar todos
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              Total selecionado: {tableData.filter(row => row.selected).length} de {tableData.length} registros
            </span>
          </div>
        </div>
        
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-white dark:bg-gray-900">
              <TableRow>
                <TableHead className="w-12"></TableHead>
                {EXPECTED_HEADERS.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.id} className={row.selected ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                  <TableCell>
                    <Checkbox 
                      checked={row.selected} 
                      onCheckedChange={(checked) => handleSelectRow(row.id, checked === true)}
                    />
                  </TableCell>
                  {EXPECTED_HEADERS.map((header) => (
                    <TableCell key={`${row.id}-${header}`}>
                      {row[header] !== undefined ? row[header] : '—'}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteRow(row.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <span className="font-semibold">
          Total de valores selecionados: 
          <span className="ml-2 text-green-600 dark:text-green-400 text-lg">
            R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </span>
        
        <Button 
          onClick={handleProcessSelected}
          disabled={tableData.filter(row => row.selected).length === 0}
          className="bg-green-600 hover:bg-green-700"
        >
          <FileText className="mr-2 h-4 w-4" />
          Processar Selecionados
        </Button>
      </div>
    </div>
  );
};

export default TableView;
