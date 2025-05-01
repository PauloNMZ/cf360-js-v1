
import React, { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { AlertCircle, CheckCircle, FileText, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import * as XLSX from 'xlsx';

// Define the expected column headers
const EXPECTED_HEADERS = [
  'NOME', 'INSCRICAO', 'BANCO', 'AGENCIA', 'CONTA', 'TIPO', 'VALOR'
];

interface PlanilhaData {
  headers: string[];
  rows: any[];
  isValid: boolean;
  missingColumns: string[];
  extraColumns: string[];
}

const ImportarPlanilha = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [planilhaData, setPlanilhaData] = useState<PlanilhaData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      const rows = jsonData.slice(1).map(row => {
        const obj: Record<string, any> = {};
        (row as any[]).forEach((cell, index) => {
          if (headers[index]) {
            obj[headers[index]] = cell;
          }
        });
        return obj;
      });

      setPlanilhaData({
        headers,
        rows,
        isValid,
        missingColumns,
        extraColumns
      });

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

    toast.success(`Processando ${planilhaData.rows.length} registros...`);
    // Aqui seria implementada a lógica de processamento da planilha
    console.log("Dados da planilha para processamento:", planilhaData.rows);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Importar Planilha</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Importe uma planilha com dados para pagamentos. A planilha deve conter as seguintes colunas:
        </p>
        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
          <div className="flex flex-wrap gap-2">
            {EXPECTED_HEADERS.map((header) => (
              <div key={header} className="px-3 py-1 bg-blue-100 dark:bg-blue-800 rounded-full text-sm text-blue-800 dark:text-blue-100">
                {header}
              </div>
            ))}
          </div>
        </div>
      </div>

      <FileUpload 
        label="Arraste ou selecione a planilha"
        accept=".xlsx,.xls,.csv"
        maxSize={10}
        maxFiles={1}
        onChange={handleFileChange}
        showDropZone={true}
      />

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro na validação</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {planilhaData && planilhaData.isValid && (
        <Alert variant="default" className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-300">Planilha válida</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">
            A planilha foi validada com sucesso! {planilhaData.rows.length} registros encontrados.
          </AlertDescription>
        </Alert>
      )}

      {planilhaData && planilhaData.extraColumns.length > 0 && (
        <Alert variant="default" className="bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800">
          <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertTitle className="text-yellow-800 dark:text-yellow-300">Aviso</AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-400">
            A planilha contém colunas extras que serão ignoradas: {planilhaData.extraColumns.join(', ')}
          </AlertDescription>
        </Alert>
      )}

      {planilhaData && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Prévia dos dados</h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {planilhaData.headers
                    .filter(header => EXPECTED_HEADERS.includes(header))
                    .map((header, index) => (
                      <th 
                        key={index} 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {planilhaData.rows.slice(0, 5).map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                    {planilhaData.headers
                      .filter(header => EXPECTED_HEADERS.includes(header))
                      .map((header, colIndex) => (
                        <td 
                          key={`${rowIndex}-${colIndex}`} 
                          className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300"
                        >
                          {row[header] !== undefined ? row[header] : '—'}
                        </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {planilhaData.rows.length > 5 && (
            <p className="text-sm text-gray-500 mt-2">
              Mostrando 5 de {planilhaData.rows.length} registros
            </p>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleProcessar} 
          disabled={!planilhaData || !planilhaData.isValid || loading}
          className="bg-green-600 hover:bg-green-700"
        >
          <FileText className="mr-2 h-4 w-4" />
          Processar Planilha
        </Button>
      </div>
    </div>
  );
};

export default ImportarPlanilha;
