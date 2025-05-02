
import { useState } from 'react';
import * as XLSX from 'xlsx';
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
      const workbook = XLSX.read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

      // Check if there's data and headers
      if (jsonData.length === 0) {
        setErrorMessage("A planilha está vazia.");
        setPlanilhaData(null);
        setLoading(false);
        return;
      }

      // Get the headers from the first row
      const headers = (jsonData[0] as string[]).map(header => 
        header ? header.toString().trim().toUpperCase() : ''
      );

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

      // Get the data rows (skip the header row)
      const rows = jsonData.slice(1).map((row, index) => {
        const obj: Record<string, any> = { id: index, selected: false };
        (row as any[]).forEach((cell, idx) => {
          if (headers[idx]) {
            obj[headers[idx]] = cell;
          }
        });
        return obj as RowData;
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
