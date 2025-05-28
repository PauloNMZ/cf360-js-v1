
import React from "react";
import { Button } from "@/components/ui/button";
import { ConvenenteData } from "@/types/convenente";
import { formatCNPJ } from "@/utils/formValidation";

interface EmpresaCardsProps {
  convenentes: Array<ConvenenteData & { id: string }>;
  currentConvenenteId: string | null;
  isLoading: boolean;
  onSelectConvenente: (convenente: ConvenenteData & { id: string }, mode: 'view' | 'edit' | 'create') => void;
}

const EmpresaCards: React.FC<EmpresaCardsProps> = ({
  convenentes,
  currentConvenenteId,
  isLoading,
  onSelectConvenente
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (convenentes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-md">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Nenhuma empresa encontrada
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Crie uma nova empresa para começar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {convenentes.map(convenente => (
        <div
          key={convenente.id}
          className={`relative bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer ${
            currentConvenenteId === convenente.id 
              ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
              : 'border-blue-400 hover:border-blue-500'
          }`}
          onClick={() => onSelectConvenente(convenente, 'view')}
        >
          {/* Header com nome da empresa */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-1 truncate">
              {convenente.razaoSocial}
            </h3>
            <div className="h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 w-full rounded"></div>
          </div>

          {/* Informações principais */}
          <div className="space-y-3 mb-6">
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                CNPJ
              </span>
              <span className="text-white font-mono text-sm">
                {formatCNPJ(convenente.cnpj)}
              </span>
            </div>

            {(convenente.agencia || convenente.conta) && (
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                  Agência / Conta
                </span>
                <span className="text-white font-mono text-sm">
                  {convenente.agencia || 'N/A'} / {convenente.conta || 'N/A'}
                </span>
              </div>
            )}

            {convenente.chavePix && (
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                  Chave PIX
                </span>
                <span className="text-white font-mono text-sm truncate">
                  {convenente.chavePix}
                </span>
              </div>
            )}
          </div>

          {/* Botão de ação */}
          <div className="absolute bottom-4 right-4">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-4 py-2 text-xs font-medium transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onSelectConvenente(convenente, 'view');
              }}
            >
              Ver detalhes da empresa
            </Button>
          </div>

          {/* Indicador de seleção */}
          {currentConvenenteId === convenente.id && (
            <div className="absolute top-2 right-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EmpresaCards;
