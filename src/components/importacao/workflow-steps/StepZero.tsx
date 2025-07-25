
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { CNABWorkflowData } from '@/types/cnab240';

interface StepZeroProps {
  workflow: CNABWorkflowData;
  updateWorkflow: (field: keyof CNABWorkflowData, value: any) => void;
  convenentes: Array<any>;
  carregandoConvenentes: boolean;
}

const StepZero: React.FC<StepZeroProps> = ({ 
  workflow, 
  updateWorkflow,
  convenentes,
  carregandoConvenentes
}) => {
  return (
    <div className="py-6 space-y-4">
      <p className="text-sm text-gray-500 mb-4">
        Selecione a empresa responsável pelos pagamentos.
      </p>
      
      {carregandoConvenentes ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <Select
          value={workflow.convenente?.id || ""}
          onValueChange={(value) => {
            const selected = convenentes.find(c => c.id === value) || null;
            updateWorkflow("convenente", selected);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma empresa" />
          </SelectTrigger>
          <SelectContent>
            {convenentes.length === 0 ? (
              <div className="p-2 text-sm text-gray-500">
                Nenhuma empresa encontrada
              </div>
            ) : (
              convenentes.map((convenente) => (
                <SelectItem key={convenente.id} value={convenente.id || ""}>
                  {convenente.razaoSocial}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      )}
      
      {workflow.convenente && (
        <Card className="mt-4">
          <CardHeader className="py-3">
            <CardTitle className="text-md">Detalhes da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <dl className="text-sm divide-y">
              <div className="grid grid-cols-3 py-2">
                <dt className="font-medium text-gray-500">CNPJ:</dt>
                <dd className="col-span-2">{workflow.convenente.cnpj}</dd>
              </div>
              <div className="grid grid-cols-3 py-2">
                <dt className="font-medium text-gray-500">Razão Social:</dt>
                <dd className="col-span-2">{workflow.convenente.razaoSocial}</dd>
              </div>
              <div className="grid grid-cols-3 py-2">
                <dt className="font-medium text-gray-500">Banco:</dt>
                <dd className="col-span-2">Ag {workflow.convenente.agencia} - Conta {workflow.convenente.conta}</dd>
              </div>
              <div className="grid grid-cols-3 py-2">
                <dt className="font-medium text-gray-500">Convênio:</dt>
                <dd className="col-span-2">{workflow.convenente.convenioPag}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StepZero;
