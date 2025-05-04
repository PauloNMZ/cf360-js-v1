
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

// Generate a unique ID that's guaranteed to be valid
const generateUniqueId = (): string => {
  return `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// Ensure we always have a valid non-empty string ID
const ensureValidId = (id: any): string => {
  if (id === null || id === undefined || String(id).trim() === '') {
    return generateUniqueId();
  }
  return String(id).trim();
};

const StepThree: React.FC<StepThreeProps> = ({ 
  workflow, 
  updateWorkflow,
  convenentes,
  carregandoConvenentes
}) => {
  // Create a safe version of the convenentes array with guaranteed valid IDs
  const safeConvenentes = useMemo(() => {
    // Ensure convenentes is an array
    if (!Array.isArray(convenentes) || convenentes.length === 0) {
      console.log("No convenentes array or empty array");
      return [];
    }
    
    // Process and filter convenentes
    const processed = convenentes
      .filter(convenente => {
        // Filter out null or undefined convenentes
        if (!convenente) {
          console.log("Filtering out null/undefined convenente");
          return false;
        }
        
        return true;
      })
      .map(convenente => {
        // Create a safe copy with guaranteed valid ID
        const validId = ensureValidId(convenente.id);
        console.log(`Processed convenente: ${convenente.razaoSocial}, ID: ${validId}`);
        
        return {
          ...convenente,
          id: validId, // Always use our validated ID
          razaoSocial: convenente.razaoSocial || "Sem nome",
          cnpj: convenente.cnpj || "N/A",
          agencia: convenente.agencia || "N/A",
          conta: convenente.conta || "N/A",
          convenioPag: convenente.convenioPag || "N/A"
        };
      });
    
    console.log(`Processed ${processed.length} convenentes`);
    return processed;
  }, [convenentes]);

  // Get the current value, ensuring it's always valid
  const currentValue = useMemo(() => {
    // If no convenente selected, return undefined (not empty string)
    if (!workflow.convenente) {
      console.log("No convenente selected");
      return undefined;
    }
    
    // Ensure the ID is valid
    if (!workflow.convenente.id) {
      console.log("Selected convenente has no ID");
      return undefined;
    }
    
    // Convert to string and validate
    const validId = ensureValidId(workflow.convenente.id);
    console.log(`Current convenente ID: ${validId}`);
    return validId;
  }, [workflow.convenente]);

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
            // Safety check: never accept empty value
            if (!value || value.trim() === '') {
              console.warn("Rejecting empty selection value");
              return;
            }
            
            const selected = safeConvenentes.find(c => c.id === value);
            console.log("Selected convenente:", selected);
            
            if (selected) {
              updateWorkflow("convenente", selected);
            } else {
              console.warn(`Could not find convenente with ID: ${value}`);
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
              safeConvenentes.map((convenente) => {
                // Final validation before rendering SelectItem
                const itemId = ensureValidId(convenente.id);
                return (
                  <SelectItem 
                    key={`conv-${itemId}`}
                    value={itemId} // This is guaranteed to be a valid non-empty string
                  >
                    {convenente.razaoSocial || "Sem nome"}
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
