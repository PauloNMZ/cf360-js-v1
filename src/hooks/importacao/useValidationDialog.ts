
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast } from '@/components/ui/sonner';

export const useValidationDialog = () => {
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [validationPerformed, setValidationPerformed] = useState(false);
  
  // Function to validate records and display errors
  const handleVerifyErrors = (validateFavorecidos: any, tableData: any[]) => {
    if (tableData.length === 0) {
      toast.error('Nenhum registro para validar. Importe uma planilha primeiro.');
      return;
    }

    const { errors, validRecordsCount, totalRecords } = validateFavorecidos(tableData);
    setValidationErrors(errors);
    setValidationPerformed(true);
    
    if (errors.length > 0) {
      setShowValidationDialog(true);
      toast.error(`Encontrados ${errors.length} registros com erros de validação`, {
        description: `${validRecordsCount} de ${totalRecords} registros estão válidos para processamento. Registros com erro serão excluídos do arquivo CNAB.`
      });
    } else {
      toast.success(`Todos os registros estão válidos!`, {
        description: `${validRecordsCount} registros validados com sucesso.`
      });
    }
  };

  // Function to export validation errors to Excel
  const handleExportErrors = () => {
    if (validationErrors.length === 0) {
      toast.warning("Não há erros para exportar.");
      return;
    }

    // Create a workbook with error data
    const errorData = validationErrors.map((record, index) => {
      const errorsText = record.errors
        .map((e: any) => `${e.message}${e.expectedValue ? ` (Esperado: ${e.expectedValue}, Informado: ${e.actualValue})` : ''}`)
        .join('\n');
      
      return {
        'ID': index + 1,
        'Nome': record.favorecido.nome,
        'Inscrição': record.favorecido.inscricao,
        'Banco': record.favorecido.banco,
        'Agência': record.favorecido.agencia,
        'Conta': record.favorecido.conta,
        'Tipo': record.favorecido.tipo,
        'Valor': record.favorecido.valor,
        'Erros': errorsText
      };
    });

    const ws = XLSX.utils.json_to_sheet(errorData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Erros de Validação");
    
    // Auto-size columns
    const colWidths = [
      { wch: 5 }, // ID
      { wch: 30 }, // Nome
      { wch: 15 }, // Inscrição
      { wch: 8 }, // Banco
      { wch: 10 }, // Agência
      { wch: 15 }, // Conta
      { wch: 6 }, // Tipo
      { wch: 12 }, // Valor
      { wch: 80 }, // Erros
    ];
    
    ws['!cols'] = colWidths;
    
    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(fileData, `Erros_Validacao_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.xlsx`);
    
    toast.success("Arquivo de erros exportado com sucesso!");
  };

  return {
    showValidationDialog,
    setShowValidationDialog,
    validationErrors,
    setValidationErrors,
    validationPerformed,
    setValidationPerformed,
    handleVerifyErrors,
    handleExportErrors
  };
};
