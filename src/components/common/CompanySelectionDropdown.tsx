
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConvenenteData } from '@/types/convenente';
import LoadingMessage from '@/components/ui/LoadingMessage';

interface CompanySelectionDropdownProps {
  convenentes: Array<ConvenenteData & { id: string }>;
  isLoading: boolean;
  error?: string | null;
  onSelectCompany: (convenente: ConvenenteData & { id: string }) => void;
  onCreateNew: () => void;
  onRetry?: () => void;
}

const CompanySelectionDropdown: React.FC<CompanySelectionDropdownProps> = ({
  convenentes,
  isLoading,
  error,
  onSelectCompany,
  onCreateNew,
  onRetry
}) => {
  const handleValueChange = (value: string) => {
    if (value === 'create-new') {
      onCreateNew();
      return;
    }
    
    const selectedConvenente = convenentes.find(c => c.id === value);
    if (selectedConvenente) {
      onSelectCompany(selectedConvenente);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-md">
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-orange-100 rounded-full">
              <Building2 className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Selecionar Empresa
            </h3>
            <p className="text-gray-600">
              Escolha uma empresa para acessar esta funcionalidade ou cadastre uma nova.
            </p>
          </div>

          <LoadingMessage
            isLoading={isLoading}
            error={error}
            loadingMessage="Carregando empresas"
            onRetry={onRetry}
          />

          {!isLoading && !error && (
            <>
              {convenentes.length === 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Nenhuma empresa cadastrada ainda.
                  </p>
                  <Button 
                    onClick={onCreateNew}
                    className="w-full bg-primary-blue hover:bg-primary-blue/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Primeira Empresa
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Select onValueChange={handleValueChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma empresa..." />
                    </SelectTrigger>
                    <SelectContent>
                      {convenentes.map((convenente) => (
                        <SelectItem key={convenente.id} value={convenente.id}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{convenente.razaoSocial}</span>
                            <span className="text-xs text-gray-500">{convenente.cnpj}</span>
                          </div>
                        </SelectItem>
                      ))}
                      <SelectItem value="create-new">
                        <div className="flex items-center">
                          <Plus className="h-4 w-4 mr-2" />
                          <span>Cadastrar Nova Empresa</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanySelectionDropdown;
