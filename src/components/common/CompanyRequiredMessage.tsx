
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompanyRequiredMessageProps {
  isEnsuring: boolean;
  onEnsureCompany: () => void;
}

const CompanyRequiredMessage: React.FC<CompanyRequiredMessageProps> = ({ 
  isEnsuring, 
  onEnsureCompany 
}) => {
  return (
    <div className="container mx-auto py-8 max-w-md">
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-orange-100 rounded-full">
              <Building2 className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Empresa Necessária
            </h3>
            <p className="text-gray-600">
              Para acessar esta funcionalidade, é necessário selecionar ou cadastrar uma empresa.
            </p>
          </div>

          <Button 
            onClick={onEnsureCompany}
            disabled={isEnsuring}
            className="w-full bg-primary-blue hover:bg-primary-blue/90"
          >
            {isEnsuring ? 'Aguardando seleção...' : 'Selecionar Empresa'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyRequiredMessage;
