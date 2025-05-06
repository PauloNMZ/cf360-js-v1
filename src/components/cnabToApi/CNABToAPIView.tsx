
import React from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, AlertCircle, CheckCircle, Copy, Upload, Send } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface CNABToAPIViewProps {
  file: File | null;
  loading: boolean;
  cnabData: any | null;
  errorMessage: string | null;
  jsonOutput: string | null;
  handleFileChange: (files: File[]) => void;
  handleProcessCNAB: () => void;
  handleCopyToClipboard: () => void;
  handleSendToAPI: () => void;
}

const CNABToAPIView: React.FC<CNABToAPIViewProps> = ({
  file,
  loading,
  cnabData,
  errorMessage,
  jsonOutput,
  handleFileChange,
  handleProcessCNAB,
  handleCopyToClipboard,
  handleSendToAPI
}) => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Converter arquivo CNAB para JSON</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Faça upload de um arquivo CNAB para converter em formato JSON para integração via API.
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload de Arquivo</TabsTrigger>
          <TabsTrigger value="output" disabled={!jsonOutput}>Saída JSON</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload de Arquivo CNAB</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload 
                label="Arraste ou selecione o arquivo CNAB" 
                accept=".rem,.txt" 
                maxSize={10} 
                maxFiles={1} 
                onChange={handleFileChange} 
                showDropZone={true} 
              />
              
              {errorMessage && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro na validação</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              
              {file && !errorMessage && (
                <Alert variant="default" className="mt-4 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle className="text-green-800 dark:text-green-300">Arquivo selecionado</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="justify-end">
              <Button 
                onClick={handleProcessCNAB} 
                disabled={!file || loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Processar Arquivo
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="output" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Resultado em JSON</CardTitle>
            </CardHeader>
            <CardContent>
              {jsonOutput && (
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto max-h-[400px]">
                    {jsonOutput}
                  </pre>
                </div>
              )}
            </CardContent>
            <CardFooter className="justify-end space-x-2">
              <Button variant="outline" onClick={handleCopyToClipboard}>
                <Copy className="mr-2 h-4 w-4" />
                Copiar JSON
              </Button>
              <Button onClick={handleSendToAPI}>
                <Send className="mr-2 h-4 w-4" />
                Enviar para API
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CNABToAPIView;
