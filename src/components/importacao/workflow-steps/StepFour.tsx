
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar, Building, CreditCard, QrCode, Download, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CNABWorkflowData } from '@/types/cnab240';

interface StepFourProps {
  workflow: CNABWorkflowData;
  updateWorkflow: (field: keyof CNABWorkflowData, value: any) => void;
  hasSelectedCompany?: boolean;
  selectedCompany?: any;
}

const StepFour: React.FC<StepFourProps> = ({ 
  workflow,
  hasSelectedCompany = false,
  selectedCompany = null
}) => {
  const handleOpenDirectorySettings = () => {
    // This will be handled by the parent component
    const event = new CustomEvent('openDirectorySettings');
    document.dispatchEvent(event);
  };

  // Determinar qual empresa usar
  const empresaAtiva = hasSelectedCompany && selectedCompany ? selectedCompany : workflow.convenente;

  // Função para obter o ícone e texto do método de envio
  const getSendMethodInfo = () => {
    switch (workflow.sendMethod) {
      case 'api':
        return {
          icon: <QrCode className="h-4 w-4 text-purple-600" />,
          label: 'API REST',
          description: 'Enviar pagamentos diretamente via API do banco'
        };
      case 'cnab':
      default:
        return {
          icon: <Download className="h-4 w-4 text-blue-600" />,
          label: 'Arquivo CNAB',
          description: 'Gerar arquivo no padrão CNAB para envio ao banco'
        };
    }
  };

  const sendMethodInfo = getSendMethodInfo();

  return (
    <div className="py-6 space-y-6">
      <div className="text-center mb-6">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Revisar Dados</h3>
        <p className="text-sm text-gray-500">
          Confirme todas as informações antes de gerar o arquivo
        </p>
      </div>

      {/* Empresa Selecionada */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-md flex items-center">
            <Building className="mr-2 h-4 w-4" />
            Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          {empresaAtiva ? (
            <dl className="text-sm divide-y">
              <div className="grid grid-cols-3 py-2">
                <dt className="font-medium text-gray-500">CNPJ:</dt>
                <dd className="col-span-2">{empresaAtiva.cnpj}</dd>
              </div>
              <div className="grid grid-cols-3 py-2">
                <dt className="font-medium text-gray-500">Razão Social:</dt>
                <dd className="col-span-2">{empresaAtiva.razaoSocial}</dd>
              </div>
              {empresaAtiva.agencia && empresaAtiva.conta && (
                <div className="grid grid-cols-3 py-2">
                  <dt className="font-medium text-gray-500">Banco:</dt>
                  <dd className="col-span-2">Ag {empresaAtiva.agencia} - Conta {empresaAtiva.conta}</dd>
                </div>
              )}
              {empresaAtiva.convenioPag && (
                <div className="grid grid-cols-3 py-2">
                  <dt className="font-medium text-gray-500">Convênio:</dt>
                  <dd className="col-span-2">{empresaAtiva.convenioPag}</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-sm text-gray-500">Nenhuma empresa selecionada</p>
          )}
        </CardContent>
      </Card>

      {/* Data de Pagamento */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-md flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Data de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          {workflow.paymentDate ? (
            <p className="text-sm">
              {format(new Date(workflow.paymentDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          ) : (
            <p className="text-sm text-gray-500">Nenhuma data selecionada</p>
          )}
        </CardContent>
      </Card>

      {/* Tipo de Serviço */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-md flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Tipo de Serviço
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <p className="text-sm">{workflow.serviceType || "Pagamentos Diversos"}</p>
        </CardContent>
      </Card>

      {/* Método de Envio */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-md flex items-center">
            {sendMethodInfo.icon}
            <span className="ml-2">Método de Envio</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <div className="space-y-1">
            <p className="text-sm font-medium">{sendMethodInfo.label}</p>
            <p className="text-xs text-gray-500">{sendMethodInfo.description}</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <Button 
          variant="outline" 
          onClick={handleOpenDirectorySettings} 
          className="w-full flex items-center justify-center"
        >
          <Settings className="mr-2 h-4 w-4" />
          Configurar Diretório de Saída
        </Button>
      </div>
    </div>
  );
};

export default StepFour;
