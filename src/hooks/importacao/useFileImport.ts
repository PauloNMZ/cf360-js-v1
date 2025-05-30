
import { useState } from 'react';
import ExcelJS from 'exceljs';
import { toast } from '@/components/ui/sonner';
import { PlanilhaData, RowData, EXPECTED_HEADERS } from '@/types/importacao';

export const useFileImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [planilhaData, setPlanilhaData] = useState<PlanilhaData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tableData, setTableData] = useState<RowData[]>([]);

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setErrorMessage(null);
      validateFile(files[0]);
    } else {
      setFile(null);
      setPlanilhaData(null);
    }
  };

  const validateFile = async (file: File) => {
    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);
      
      const worksheet = workbook.getWorksheet(1);
      if (!worksheet) {
        throw new Error("Planilha não encontrada");
      }

      // Get headers from first row - ExcelJS returns array with undefined at index 0
      const headerRow = worksheet.getRow(1);
      const rawHeaders = headerRow.values as any[];
      
      // Filter out undefined/null values and convert to string, skipping index 0
      const headers = rawHeaders
        .slice(1) // Remove the undefined value at index 0
        .map(header => header ? header.toString().trim().toUpperCase() : '')
        .filter(header => header !== ''); // Remove empty headers

      console.log("Headers extraídos:", headers);

      // Validate headers against expected headers
      const missingColumns = EXPECTED_HEADERS.filter(
        header => !headers.includes(header)
      );
      
      const extraColumns = headers.filter(
        header => header && !EXPECTED_HEADERS.includes(header)
      );

      const isValid = missingColumns.length === 0;

      if (!isValid) {
        setErrorMessage(`A planilha não contém todas as colunas necessárias. Faltando: ${missingColumns.join(', ')}`);
      } else {
        setErrorMessage(null);
      }

      // Get data rows
      const rows: RowData[] = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row
        
        const rowData: Record<string, any> = { id: rowNumber - 2, selected: false };
        const cellValues = row.values as any[];
        
        // Map cell values to headers, skipping index 0 from ExcelJS
        headers.forEach((header, headerIndex) => {
          const cellIndex = headerIndex + 1; // Adjust for ExcelJS indexing (skip index 0)
          if (cellValues[cellIndex] !== undefined) {
            rowData[header] = cellValues[cellIndex];
          }
        });
        
        console.log(`Linha ${rowNumber}:`, rowData);
        rows.push(rowData as RowData);
      });

      setPlanilhaData({
        headers,
        rows,
        isValid,
        missingColumns,
        extraColumns
      });

      // Initialize tableData with selected property for each row
      setTableData(rows);

      if (isValid) {
        toast.success("Planilha validada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao processar planilha:", error);
      setErrorMessage("Erro ao processar a planilha. Verifique se o arquivo está em um formato válido (XLSX, XLS, CSV).");
      setPlanilhaData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessar = () => {
    if (!planilhaData || !planilhaData.isValid) {
      toast.error("A planilha não é válida para processamento.");
      return;
    }

    toast.success(`Mostrando ${tableData.length} registros.`);
    return true;
  };

  return {
    file,
    loading,
    planilhaData,
    errorMessage,
    tableData,
    setTableData,
    handleFileChange,
    validateFile,
    handleProcessar
  };
};
