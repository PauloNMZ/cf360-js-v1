
import React, { useMemo } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CNABWorkflowData } from '@/types/cnab240';

interface StepThreeProps {
  workflow: CNABWorkflowData;
  updateWorkflow: (field: keyof CNABWorkflowData, value: any) => void;
  convenentes: Array<any>;
  carregandoConvenentes: boolean;
}

const StepThree: React.FC<StepThreeProps> = ({ 
  workflow, 
  updateWorkflow,
  convenentes,
  carregandoConvenentes
}) => {
  // Create a safe version of the convenentes array with guaranteed valid IDs
  const safeConvenentes = useMemo(() => {
    // First ensure convenentes is an array
    if (!Array.isArray(convenentes)) return [];
    
    return convenentes
      .filter(convenente => {
        // Filter out null or undefined convenente objects
        if (!convenente) return false;
        
        // Ensure ID exists and is not empty
        const id = convenente.id;
        return id !== null && id !== undefined && String(id).trim() !== "";
      })
      .map(convenente => {
        // Ensure all needed properties have default values
        const id = String(convenente.id).trim();
        return {
          ...convenente,
          id, // Ensure ID is a clean string
          razaoSocial: convenente.razaoSocial || "Sem nome",
          cnpj: convenente.cnpj || "N/A",
          agencia: convenente.agencia || "N/A",
          conta: convenente.conta || "N/A",
          convenioPag: convenente.convenioPag || "N/A"
        };
      });
  }, [convenentes]);

  // Generate a default ID for fallback
  const defaultId = useMemo(() => `default-${Math.random().toString(36).substring(2)}`, []);

  return (
    <div className="py-6 space-y-4">
      <p className="text-sm text-gray-500 mb-4">
        Selecione o convenente responsável pelos pagamentos.
      </p>
      
      {carregandoConvenentes ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <Select
          value={workflow.convenente?.id ? String(workflow.convenente.id) : undefined}
          onValueChange={(value) => {
            const selected = safeConvenentes.find(c => c.id === value) || null;
            updateWorkflow("convenente", selected);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um convenente" />
          </SelectTrigger>
          <SelectContent>
            {safeConvenentes.length === 0 ? (
              <div className="p-2 text-sm text-gray-500">
                Nenhum convenente encontrado
              </div>
            ) : (
              safeConvenentes.map((convenente) => {
                // Ensure we always have a non-empty string value for the SelectItem
                const valueId = convenente.id || defaultId;
                const uniqueKey = `convenente-${valueId}-${Math.random().toString(36).substring(2)}`;
                
                return (
                  <SelectItem 
                    key={uniqueKey}
                    value={valueId}
                  >
                    {convenente.razaoSocial}
                  </SelectItem>
                );
              })
            )}
          </SelectContent>
        </Select>
      )}
      
      {workflow.convenente && (
        <Card className="mt-4">
          <CardHeader className="py-3">
            <CardTitle className="text-md">Detalhes do Convenente</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <dl className="text-sm divide-y">
              <div className="grid grid-cols-3 py-2">
                <dt className="font-medium text-gray-500">CNPJ:</dt>
                <dd className="col-span-2">{workflow.convenente.cnpj || "Não informado"}</dd>
              </div>
              <div className="grid grid-cols-3 py-2">
                <dt className="font-medium text-gray-500">Razão Social:</dt>
                <dd className="col-span-2">{workflow.convenente.razaoSocial || "Não informado"}</dd>
              </div>
              <div className="grid grid-cols-3 py-2">
                <dt className="font-medium text-gray-500">Banco:</dt>
                <dd className="col-span-2">
                  {workflow.convenente.agencia && workflow.convenente.conta 
                    ? `Ag ${workflow.convenente.agencia} - Conta ${workflow.convenente.conta}`
                    : "Não informado"}
                </dd>
              </div>
              <div className="grid grid-cols-3 py-2">
                <dt className="font-medium text-gray-500">Convênio:</dt>
                <dd className="col-span-2">{workflow.convenente.convenioPag || "Não informado"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StepThree;
