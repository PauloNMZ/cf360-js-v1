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

      // Get headers from first row
      const headers = worksheet.getRow(1).values as string[];
      const formattedHeaders = headers.map(header => 
        header ? header.toString().trim().toUpperCase() : ''
      );

      // Validate headers against expected headers
      const missingColumns = EXPECTED_HEADERS.filter(
        header => !formattedHeaders.includes(header)
      );
      
      const extraColumns = formattedHeaders.filter(
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
        row.eachCell((cell, colNumber) => {
          const header = formattedHeaders[colNumber - 1];
          if (header) {
            rowData[header] = cell.value;
          }
        });
        rows.push(rowData as RowData);
      });

      setPlanilhaData({
        headers: formattedHeaders,
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
