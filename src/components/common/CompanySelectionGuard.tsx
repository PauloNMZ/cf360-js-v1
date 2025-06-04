
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, AlertTriangle, Plus } from 'lucide-react';
import { useCompanySelectionDetection } from '@/hooks/useCompanySelectionDetection';
import LoadingMessage from '@/components/ui/LoadingMessage';

interface CompanySelectionGuardProps {
  children: React.ReactNode;
  fallbackMessage?: string;
  redirectRoute?: string;
  showCreateOption?: boolean;
}

const CompanySelectionGuard: React.FC<CompanySelectionGuardProps> = ({
  children,
  fallbackMessage = "Para acessar esta funcionalidade, você precisa selecionar uma empresa primeiro.",
  redirectRoute = '/empresa',
  showCreateOption = true
}) => {
  const navigate = useNavigate();
  const { hasCompany, isLoading, error, source, company } = useCompanySelectionDetection();

  const handleRedirectToCompany = () => {
    navigate(redirectRoute);
  };

  const handleCreateCompany = () => {
    navigate('/empresa?mode=create');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <LoadingMessage 
          isLoading={true} 
          loadingMessage="Verificando empresa selecionada..." 
        />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto py-8 max-w-md">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-red-100 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Erro na Detecção de Empresa
              </h3>
              <p className="text-gray-600">{error}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Tentar Novamente
              </Button>
              <Button onClick={handleRedirectToCompany} className="bg-primary-blue hover:bg-primary-blue/90">
                <Building2 className="h-4 w-4 mr-2" />
                Ir para Empresas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show company selection required state
  if (!hasCompany) {
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
                Empresa Não Selecionada
              </h3>
              <p className="text-gray-600">{fallbackMessage}</p>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Selecione uma empresa para continuar ou cadastre uma nova.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={handleRedirectToCompany} className="bg-primary-blue hover:bg-primary-blue/90">
                <Building2 className="h-4 w-4 mr-2" />
                Selecionar Empresa
              </Button>
              {showCreateOption && (
                <Button variant="outline" onClick={handleCreateCompany}>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Nova
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Company detected - show success info and render children
  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-sm text-green-800">
          <Building2 className="h-4 w-4" />
          <span className="font-medium">Empresa selecionada:</span>
          <span>{company?.razaoSocial}</span>
          <span className="text-green-600">({source})</span>
        </div>
      </div>
      {children}
    </div>
  );
};

export default CompanySelectionGuard;
