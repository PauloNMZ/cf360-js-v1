
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle, Calendar, Building, CreditCard, QrCode, Download } from 'lucide-react';
import { CNABWorkflowData } from '@/types/cnab240';
import { formatCNPJ } from '@/utils/formatting/cnpjFormatter';

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
          description: 'Gerar arquivo no padrão CNAB para download'
        };
    }
  };

  const sendMethodInfo = getSendMethodInfo();

  return (
    <div className="py-4 space-y-4">
      <div className="text-center mb-4">
        <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">Revisar Dados</h3>
        <p className="text-sm text-gray-500">
          Confirme todas as informações antes de gerar o arquivo
        </p>
      </div>

      {/* Informações em formato compacto */}
      <div className="space-y-3">
        {/* Empresa Selecionada */}
        <div className="border rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Building className="mr-2 h-4 w-4 text-gray-600" />
            <span className="font-medium text-sm">Empresa</span>
          </div>
          {empresaAtiva ? (
            <div className="text-sm space-y-1">
              <div><span className="font-medium">CNPJ:</span> {formatCNPJ(empresaAtiva.cnpj)}</div>
              <div><span className="font-medium">Razão Social:</span> {empresaAtiva.razaoSocial}</div>
              {empresaAtiva.agencia && empresaAtiva.conta && (
                <div><span className="font-medium">Banco:</span> Ag {empresaAtiva.agencia} - Conta {empresaAtiva.conta}</div>
              )}
              {empresaAtiva.convenioPag && (
                <div><span className="font-medium">Convênio:</span> {empresaAtiva.convenioPag}</div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nenhuma empresa selecionada</p>
          )}
        </div>

        {/* Data de Pagamento */}
        <div className="border rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Calendar className="mr-2 h-4 w-4 text-gray-600" />
            <span className="font-medium text-sm">Data de Pagamento</span>
          </div>
          {workflow.paymentDate ? (
            <p className="text-sm">
              {format(new Date(workflow.paymentDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          ) : (
            <p className="text-sm text-gray-500">Nenhuma data selecionada</p>
          )}
        </div>

        {/* Tipo de Serviço */}
        <div className="border rounded-lg p-3">
          <div className="flex items-center mb-2">
            <CreditCard className="mr-2 h-4 w-4 text-gray-600" />
            <span className="font-medium text-sm">Tipo de Serviço</span>
          </div>
          <p className="text-sm">{workflow.serviceType || "Pagamentos Diversos"}</p>
        </div>

        {/* Método de Envio */}
        <div className="border rounded-lg p-3">
          <div className="flex items-center mb-2">
            {sendMethodInfo.icon}
            <span className="ml-2 font-medium text-sm">Método de Envio</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">{sendMethodInfo.label}</p>
            <p className="text-xs text-gray-500">{sendMethodInfo.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepFour;
