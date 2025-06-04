
import React from 'react';
import { QrCode, Download } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CNABWorkflowData } from '@/types/cnab240';

interface StepThreeProps {
  workflow: CNABWorkflowData;
  updateWorkflow: (field: keyof CNABWorkflowData, value: any) => void;
}

const StepThree: React.FC<StepThreeProps> = ({ workflow, updateWorkflow }) => {
  return (
    <div className="py-6">
      <p className="text-sm text-gray-500 mb-4">
        Selecione o método para enviar estes pagamentos ao banco.
      </p>
      <RadioGroup value={workflow.sendMethod} onValueChange={(value) => updateWorkflow("sendMethod", value)} className="space-y-4">
        <div className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
          <RadioGroupItem value="cnab" id="cnab" />
          <Label htmlFor="cnab" className="flex flex-1 items-center space-x-3 cursor-pointer">
            <Download className="h-5 w-5 text-blue-600" />
            <div className="space-y-1">
              <p className="font-medium leading-none">Arquivo CNAB</p>
              <p className="text-sm text-gray-500">Gerar arquivo no padrão CNAB para envio ao banco</p>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
          <RadioGroupItem value="api" id="api" />
          <Label htmlFor="api" className="flex flex-1 items-center space-x-3 cursor-pointer">
            <QrCode className="h-5 w-5 text-purple-600" />
            <div className="space-y-1">
              <p className="font-medium leading-none">API REST</p>
              <p className="text-sm text-gray-500">Enviar pagamentos diretamente via API do banco</p>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default StepThree;
