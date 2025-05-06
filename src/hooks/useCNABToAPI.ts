
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import { 
  parseCNABFile, 
  convertCNABToJSON, 
  sendToAPI,
  ParsedCNABData
} from '@/services/cnabToApiService';

export const useCNABToAPI = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [cnabData, setCnabData] = useState<ParsedCNABData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [jsonOutput, setJsonOutput] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setErrorMessage(null);
      setCnabData(null);
      setJsonOutput(null);
    }
  };

  // Process the CNAB file
  const handleProcessCNAB = async () => {
    if (!file) {
      setErrorMessage('Nenhum arquivo selecionado.');
      return;
    }

    setLoading(true);
    try {
      // Parse the CNAB file
      const data = await parseCNABFile(file);
      setCnabData(data);

      // Convert CNAB data to JSON
      const json = convertCNABToJSON(data);
      setJsonOutput(JSON.stringify(json, null, 2));

      toast.success('Arquivo CNAB processado com sucesso!');
    } catch (error) {
      console.error('Erro ao processar arquivo CNAB:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao processar o arquivo CNAB.');
      toast.error('Erro ao processar arquivo', {
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao processar o arquivo CNAB.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Copy JSON to clipboard
  const handleCopyToClipboard = () => {
    if (jsonOutput) {
      navigator.clipboard.writeText(jsonOutput)
        .then(() => {
          toast.success('JSON copiado para a área de transferência!');
        })
        .catch((error) => {
          console.error('Erro ao copiar para a área de transferência:', error);
          toast.error('Erro ao copiar para a área de transferência');
        });
    }
  };

  // Send the JSON data to an API
  const handleSendToAPI = async () => {
    if (!jsonOutput) {
      toast.error('Nenhum dado JSON para enviar.');
      return;
    }

    setLoading(true);
    try {
      await sendToAPI(JSON.parse(jsonOutput));
      toast.success('Dados enviados com sucesso para a API!');
    } catch (error) {
      console.error('Erro ao enviar dados para a API:', error);
      toast.error('Erro ao enviar dados para a API', {
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao enviar os dados para a API.',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    file,
    loading,
    cnabData,
    errorMessage,
    jsonOutput,
    handleFileChange,
    handleProcessCNAB,
    handleCopyToClipboard,
    handleSendToAPI
  };
};
