
import React from "react";
import { FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FileOptionsCardProps {
  fileOption: 'single' | 'multiple';
  isProcessing: boolean;
  selectedGroups: string[];
  onFileOptionChange: (value: 'single' | 'multiple') => void;
  onGeneratePayments: () => void;
}

const FileOptionsCard = ({ 
  fileOption, 
  isProcessing, 
  selectedGroups, 
  onFileOptionChange, 
  onGeneratePayments 
}: FileOptionsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Opções de Geração</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="fileOptions" className="w-full">
          <TabsList className="grid w-full grid-cols-1 max-w-md mx-auto">
            <TabsTrigger value="fileOptions">Opções de Arquivo</TabsTrigger>
          </TabsList>
          <TabsContent value="fileOptions" className="py-4">
            <RadioGroup 
              value={fileOption} 
              onValueChange={(value) => onFileOptionChange(value as 'single' | 'multiple')}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 rounded-md border p-4">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single" className="flex flex-col">
                  <span className="font-medium">Arquivo único consolidado</span>
                  <span className="text-sm text-muted-foreground">Gerar um único arquivo CNAB com todos os pagamentos</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-4">
                <RadioGroupItem value="multiple" id="multiple" />
                <Label htmlFor="multiple" className="flex flex-col">
                  <span className="font-medium">Múltiplos arquivos</span>
                  <span className="text-sm text-muted-foreground">Gerar um arquivo CNAB separado para cada grupo</span>
                </Label>
              </div>
            </RadioGroup>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button 
            onClick={onGeneratePayments} 
            disabled={isProcessing || selectedGroups.length === 0}
            size="lg"
            className="w-full"
          >
            {isProcessing ? (
              <>Processando...</>
            ) : (
              <>
                <FileText size={16} className="mr-2" />
                Gerar {fileOption === 'single' ? "Arquivo de Pagamento" : "Arquivos de Pagamento"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileOptionsCard;
