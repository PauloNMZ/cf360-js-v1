
import React from 'react';
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

// Generate a fallback ID for items without one
const generateFallbackId = (): string => {
  return `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// Ensure we always have a valid non-empty string ID
const ensureValidId = (id: any): string => {
  if (id === null || id === undefined || String(id).trim() === '') {
    return generateFallbackId();
  }
  return String(id).trim();
};

const StepThree: React.FC<StepThreeProps> = ({ 
  workflow, 
  updateWorkflow,
  convenentes,
  carregandoConvenentes
}) => {
  // Filter and validate convenentes to ensure they all have valid IDs
  const validConvenentes = React.useMemo(() => {
    if (!Array.isArray(convenentes) || convenentes.length === 0) {
      console.log("No valid convenentes array provided");
      return [];
    }
    
    // First, filter out any invalid entries
    const filtered = convenentes
      .filter(convenente => 
        convenente && 
        typeof convenente === 'object' && 
        convenente.razaoSocial
      );
    
    // Then, map each valid convenente to include guaranteed valid IDs
    return filtered.map(convenente => {
      const validId = ensureValidId(convenente.id);
      
      // Return a clean object with guaranteed valid properties
      return {
        ...convenente,
        id: validId,
        razaoSocial: convenente.razaoSocial || "Sem nome",
        cnpj: convenente.cnpj || "N/A",
        agencia: convenente.agencia || "N/A",
        conta: convenente.conta || "N/A",
        convenioPag: convenente.convenioPag || "N/A"
      };
    });
  }, [convenentes]);

  // Determine the current value safely
  const currentValue = React.useMemo(() => {
    if (!workflow.convenente || !workflow.convenente.id) {
      return undefined;
    }
    return ensureValidId(workflow.convenente.id);
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
            if (!value || value.trim() === '') {
              console.warn("Empty selection value detected");
              return;
            }
            
            const selected = validConvenentes.find(c => c.id === value);
            if (selected) {
              updateWorkflow("convenente", selected);
            } else {
              console.warn("Selected convenente not found:", value);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um convenente" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {validConvenentes.length === 0 ? (
              <div className="p-2 text-sm text-gray-500">
                Nenhum convenente encontrado
              </div>
            ) : (
              validConvenentes.map((convenente) => {
                // Never trust the data - always ensure a valid ID
                const safeId = ensureValidId(convenente.id);
                
                // Skip rendering items with empty IDs (should never happen with our validation)
                if (!safeId) {
                  console.error("Failed to generate valid ID for convenente:", convenente);
                  return null;
                }
                
                return (
                  <SelectItem 
                    key={`conv-${safeId}`}
                    value={safeId}
                  >
                    {convenente.razaoSocial || "Convenente sem nome"}
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
