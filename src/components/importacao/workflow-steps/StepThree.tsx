
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { CNABWorkflowData } from '@/types/cnab240';

interface StepThreeProps {
  workflow: CNABWorkflowData;
  updateWorkflow: (field: keyof CNABWorkflowData, value: any) => void;
  convenentes: Array<any>;
  carregandoConvenentes: boolean;
  hasSelectedCompany?: boolean;
  selectedCompany?: any;
}

const StepThree: React.FC<StepThreeProps> = ({ 
  workflow, 
  updateWorkflow,
  convenentes,
  carregandoConvenentes,
  hasSelectedCompany = false,
  selectedCompany = null
}) => {
  
  // If there's a company selected in header, show it and allow to proceed
  if (hasSelectedCompany && selectedCompany) {
    return (
      <div className="py-6 space-y-4">
        <p className="text-sm text-gray-500 mb-4">
          Empresa selecionada no cabeçalho:
        </p>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-md">Empresa Ativa</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <dl className="text-sm divide-y">
              <div className="grid grid-cols-3 py-2">
                <dt className="font-medium text-gray-500">CNPJ:</dt>
                <dd className="col-span-2">{selectedCompany.cnpj}</dd>
              </div>
              <div className="grid grid-cols-3 py-2">
                <dt className="font-medium text-gray-500">Razão Social:</dt>
                <dd className="col-span-2">{selectedCompany.razaoSocial}</dd>
              </div>
              {selectedCompany.agencia && selectedCompany.conta && (
                <div className="grid grid-cols-3 py-2">
                  <dt className="font-medium text-gray-500">Banco:</dt>
                  <dd className="col-span-2">Ag {selectedCompany.agencia} - Conta {selectedCompany.conta}</dd>
                </div>
              )}
              {selectedCompany.convenioPag && (
                <div className="grid grid-cols-3 py-2">
                  <dt className="font-medium text-gray-500">Convênio:</dt>
                  <dd className="col-span-2">{selectedCompany.convenioPag}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
        
        <p className="text-xs text-gray-400 mt-4">
          Esta empresa será utilizada para o processamento dos pagamentos.
        </p>
      </div>
    );
  }

  // If no company is selected in header, show warning message
  if (!hasSelectedCompany) {
    return (
      <div className="py-6 space-y-4">
        <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-4 rounded-lg border border-amber-200">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Nenhuma empresa selecionada</p>
            <p className="text-sm">
              Por favor, selecione uma empresa no cabeçalho da página antes de continuar com o processamento dos pagamentos.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Fallback: show convenente selection
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

export default StepThree;
