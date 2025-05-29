
import React from "react";
import { Button } from "@/components/ui/button";
import { ConvenenteData } from "@/types/convenente";
import { formatCNPJ } from "@/utils/formValidation";
import { Eye, Pencil, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";

interface EmpresaCardsProps {
  convenentes: Array<ConvenenteData & {
    id: string;
  }>;
  currentConvenenteId: string | null;
  isLoading: boolean;
  onSelectConvenente: (convenente: ConvenenteData & {
    id: string;
  }, mode: 'view' | 'edit' | 'create') => void;
}

const EmpresaCards: React.FC<EmpresaCardsProps> = ({
  convenentes,
  currentConvenenteId,
  isLoading,
  onSelectConvenente
}) => {
  const handleCopyCardInfo = (convenente: ConvenenteData) => {
    const cardText = `
Empresa: ${convenente.razaoSocial}
CNPJ: ${formatCNPJ(convenente.cnpj)}
${convenente.agencia ? `Agência: ${convenente.agencia}` : ''}
${convenente.conta ? `Conta: ${convenente.conta}` : ''}
${convenente.chavePix ? `Chave PIX: ${convenente.chavePix}` : ''}
    `.trim();

    navigator.clipboard.writeText(cardText).then(() => {
      toast.success("Informações copiadas para a área de transferência");
    }).catch(() => {
      toast.error("Erro ao copiar informações");
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>;
  }

  if (convenentes.length === 0) {
    return <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-md">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Nenhuma empresa encontrada
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Crie uma nova empresa para começar
          </p>
        </div>
      </div>;
  }

  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {convenentes.map(convenente => <div key={convenente.id} className={`bg-[#E2E8F0] dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer flex flex-col relative ${currentConvenenteId === convenente.id ? 'border-2 border-blue-500 shadow-lg shadow-blue-500/20' : 'border-2 border-transparent hover:border-blue-500'}`} onClick={() => onSelectConvenente(convenente, 'view')}>
          
          {/* Action icons */}
          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              onClick={e => {
                e.stopPropagation();
                onSelectConvenente(convenente, 'view');
              }}
              className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
              title="Ver detalhes"
            >
              <Eye size={14} className="text-gray-300 hover:text-white" />
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                handleCopyCardInfo(convenente);
              }}
              className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
              title="Copiar informações"
            >
              <Copy size={14} className="text-gray-300 hover:text-white" />
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                onSelectConvenente(convenente, 'edit');
              }}
              className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
              title="Editar"
            >
              <Pencil size={14} className="text-gray-300 hover:text-white" />
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                // Note: Delete functionality would need to be implemented in parent component
                console.log('Delete clicked for', convenente.id);
              }}
              className="p-1.5 rounded-md bg-gray-700 hover:bg-red-600 transition-colors"
              title="Excluir"
            >
              <Trash2 size={14} className="text-gray-300 hover:text-white" />
            </button>
          </div>

          {/* Header com nome da empresa */}
          <div className="mb-4 pr-32">
            <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate text-sm">
              {convenente.razaoSocial}
            </h3>
            <div className="h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 w-full rounded"></div>
          </div>

          {/* Informações principais */}
          <div className="space-y-3 flex-grow">
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-medium">
                CNPJ
              </span>
              <span className="text-gray-900 dark:text-white font-mono text-sm">
                {formatCNPJ(convenente.cnpj)}
              </span>
            </div>

            {(convenente.agencia || convenente.conta) && <div className="flex flex-col space-y-1">
                <span className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-medium">
                  Agência / Conta
                </span>
                <span className="text-gray-900 dark:text-white font-mono text-sm">
                  {convenente.agencia || 'N/A'} / {convenente.conta || 'N/A'}
                </span>
              </div>}

            {convenente.chavePix && <div className="flex flex-col space-y-1">
                <span className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-medium">
                  Chave PIX
                </span>
                <span className="text-gray-900 dark:text-white font-mono text-sm truncate">
                  {convenente.chavePix}
                </span>
              </div>}
          </div>

          {/* Indicador de seleção */}
          {currentConvenenteId === convenente.id && <div className="absolute top-2 left-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            </div>}
        </div>)}
    </div>;
};

export default EmpresaCards;
