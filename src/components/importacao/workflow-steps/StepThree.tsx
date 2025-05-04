
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
    const convenentesArray = Array.isArray(convenentes) ? convenentes : [];
    
    // Only include valid convenente objects with non-empty IDs
    return convenentesArray
      .filter(convenente => {
        // Filter out null, undefined, or objects without valid IDs
        return (
          convenente !== null && 
          convenente !== undefined && 
          convenente.id !== null && 
          convenente.id !== undefined && 
          String(convenente.id).trim() !== ''
        );
      })
      .map((convenente, index) => {
        // Make sure we're working with a valid ID (string type, non-empty)
        const id = String(convenente.id || `fallback-id-${index}`).trim();
        
        // Return a safe convenente object with guaranteed properties
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

  // Get a safe current value for the select component
  const currentValue = useMemo(() => {
    if (!workflow.convenente || !workflow.convenente.id) {
      return undefined;
    }
    
    const id = String(workflow.convenente.id).trim();
    return id !== "" ? id : undefined;
  }, [workflow.convenente]);

  // Debug logs
  console.log("Available convenentes:", safeConvenentes); 
  console.log("Current value:", currentValue);

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
          value={currentValue}
          onValueChange={(value) => {
            // Only find matching convenentes with non-empty values
            if (value && value.trim() !== '') {
              const selected = safeConvenentes.find(c => c.id === value) || null;
              updateWorkflow("convenente", selected);
            }
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
              safeConvenentes.map((convenente) => (
                <SelectItem 
                  key={`conv-${convenente.id}`}
                  value={convenente.id}
                >
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
