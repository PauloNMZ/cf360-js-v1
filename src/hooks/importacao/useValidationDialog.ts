
import { useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useNotificationModalContext } from '@/components/ui/NotificationModalProvider';

export const useValidationDialog = () => {
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [validationPerformed, setValidationPerformed] = useState(false);
  const { showSuccess, showError, showWarning } = useNotificationModalContext();
  
  // Function to validate records and display errors
  const handleVerifyErrors = (validateFavorecidos: any, tableData: any[]) => {
    console.log("useValidationDialog - handleVerifyErrors chamado");
    console.log("useValidationDialog - tableData length:", tableData.length);
    console.log("useValidationDialog - validateFavorecidos function:", typeof validateFavorecidos);
    
    if (tableData.length === 0) {
      console.log("useValidationDialog - Nenhum registro para validar");
      showError('Erro!', 'Nenhum registro para validar. Importe uma planilha primeiro.');
      return;
    }

    console.log("useValidationDialog - Executando validação...");
    const { errors, validRecordsCount, totalRecords } = validateFavorecidos(tableData);
    console.log("useValidationDialog - Resultado da validação:", { errors: errors.length, validRecordsCount, totalRecords });
    
    setValidationErrors(errors);
    setValidationPerformed(true);
    
    if (errors.length > 0) {
      setShowValidationDialog(true);
      showError('Erro!', `Encontrados ${errors.length} registros com erros de validação. ${validRecordsCount} de ${totalRecords} registros estão válidos para processamento. Registros com erro serão excluídos do arquivo CNAB.`);
    } else {
      showSuccess('Sucesso!', `Todos os registros estão válidos! ${validRecordsCount} registros validados com sucesso.`);
    }
  };

  // Function to export validation errors to Excel
  const handleExportErrors = async () => {
    console.log("useValidationDialog - handleExportErrors chamado");
    console.log("useValidationDialog - validationErrors length:", validationErrors.length);
    
    if (validationErrors.length === 0) {
      showWarning("Atenção!", "Não há erros para exportar.");
      return;
    }

    // Create a workbook with error data
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Erros de Validação');

    // Add headers
    const headers = ['ID', 'Nome', 'Inscrição', 'Banco', 'Agência', 'Conta', 'Tipo', 'Valor', 'Erros'];
    worksheet.addRow(headers);

    // Add data
    validationErrors.forEach((record, index) => {
      const errorsText = record.errors
        .map((e: any) => `${e.message}${e.expectedValue ? ` (Esperado: ${e.expectedValue}, Informado: ${e.actualValue})` : ''}`)
        .join('\n');
      
      worksheet.addRow([
        index + 1,
        record.favorecido.nome,
        record.favorecido.inscricao,
        record.favorecido.banco,
        record.favorecido.agencia,
        record.favorecido.conta,
        record.favorecido.tipo,
        record.favorecido.valor,
        errorsText
      ]);
    });

    // Set column widths
    const colWidths = [5, 30, 15, 8, 10, 15, 6, 12, 80];
    worksheet.columns.forEach((column, index) => {
      column.width = colWidths[index];
    });

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const fileData = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(fileData, `Erros_Validacao_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.xlsx`);
    
    showSuccess("Sucesso!", "Arquivo de erros exportado com sucesso!");
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
