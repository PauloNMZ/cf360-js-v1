
import React from 'react';
import { Banknote, CreditCard, Coins, PiggyBank } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CNABWorkflowData } from '@/types/cnab240';

interface StepTwoProps {
  workflow: CNABWorkflowData;
  updateWorkflow: (field: keyof CNABWorkflowData, value: any) => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ workflow, updateWorkflow }) => {
  return (
    <div className="py-6">
      <p className="text-sm text-gray-500 mb-4">
        Selecione o tipo de serviço para estes pagamentos.
      </p>
      <RadioGroup 
        value={workflow.serviceType} 
        onValueChange={(value) => updateWorkflow("serviceType", value)} 
        className="space-y-3"
      >
        <div className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
          <RadioGroupItem value="Pagamentos Diversos" id="diversos" />
          <Label htmlFor="diversos" className="flex flex-1 items-center space-x-3 cursor-pointer">
            <Banknote className="h-5 w-5 text-blue-600" />
            <div className="space-y-0.5">
              <p className="font-medium leading-none">Pagamentos Diversos</p>
              <p className="text-sm text-gray-500">Pagamentos para qualquer finalidade</p>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
          <RadioGroupItem value="Pagamentos de Salarios" id="salarios" />
          <Label htmlFor="salarios" className="flex flex-1 items-center space-x-3 cursor-pointer">
            <CreditCard className="h-5 w-5 text-green-600" />
            <div className="space-y-0.5">
              <p className="font-medium leading-none">Pagamentos de Salários</p>
              <p className="text-sm text-gray-500">Folha de pagamento e benefícios</p>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
          <RadioGroupItem value="Pagamento de Fornecedores" id="fornecedores" />
          <Label htmlFor="fornecedores" className="flex flex-1 items-center space-x-3 cursor-pointer">
            <Coins className="h-5 w-5 text-orange-600" />
            <div className="space-y-0.5">
              <p className="font-medium leading-none">Pagamento de Fornecedores</p>
              <p className="text-sm text-gray-500">Pagamentos para fornecedores e prestadores</p>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
          <RadioGroupItem value="Pix Transferências" id="pix" />
          <Label htmlFor="pix" className="flex flex-1 items-center space-x-3 cursor-pointer">
            <PiggyBank className="h-5 w-5 text-purple-600" />
            <div className="space-y-0.5">
              <p className="font-medium leading-none">Pix Transferências</p>
              <p className="text-sm text-gray-500">Transferências via Pix</p>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default StepTwo;
