
import React from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConvenenteData } from "@/types/convenente";
import { formatCNPJ } from "@/utils/formValidation";

interface EmpresaListProps {
  convenentes: Array<ConvenenteData & { id: string }>;
  currentConvenenteId: string | null;
  isLoading: boolean;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectConvenente: (convenente: ConvenenteData & { id: string }, mode: 'view' | 'edit' | 'create') => void;
  onNewConvenente: () => void;
}

const EmpresaList: React.FC<EmpresaListProps> = ({
  convenentes,
  currentConvenenteId,
  isLoading,
  onSearchChange,
  onSelectConvenente,
  onNewConvenente
}) => {
  return (
    <div className="md:col-span-1">
      <div className="mb-4 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Buscar empresas..." 
            className="pl-10 border-border focus:border-primary bg-input text-foreground" 
            onChange={onSearchChange} 
          />
        </div>
      </div>
      
      <div className="max-h-[500px] overflow-y-auto border border-border rounded-lg bg-background">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : convenentes.length > 0 ? (
          <ul className="space-y-2 p-2">
            {convenentes.map(convenente => (
              <li 
                key={convenente.id} 
                onClick={() => {
                  console.log('EmpresaList - Item da lista clicado:', convenente.id);
                  onSelectConvenente(convenente, 'view');
                }} 
                className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                  currentConvenenteId === convenente.id 
                    ? 'bg-accent border-primary text-primary-foreground' 
                    : 'hover:bg-accent/50 border-border text-foreground'
                }`}
              >
                <h3 className="font-medium text-[#5A8AF0] text-gray-500">
                  {convenente.razaoSocial}
                </h3>
                <p className="text-sm text-muted-foreground">
                  CNPJ: {formatCNPJ(convenente.cnpj)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-10 rounded-lg border border-dashed text-foreground bg-muted border-border">
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhum convenente encontrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Crie um novo convenente para começar
            </p>
            <Button onClick={onNewConvenente} className="bg-primary-blue hover:bg-primary-blue/90">
              <Plus size={16} className="mr-2" />
              Criar Nova Empresa
            </Button>
          </div>
        )}
      </div>
      
      <Button onClick={onNewConvenente} className="w-full mt-4">
        <Plus size={16} className="mr-2" /> 
        Nova Empresa
      </Button>
    </div>
  );
};

export default EmpresaList;
