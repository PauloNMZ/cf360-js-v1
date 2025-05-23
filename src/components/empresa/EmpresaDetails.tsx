
import React from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConvenenteData } from "@/types/convenente";
import { formatCNPJ } from "@/utils/formValidation";

interface EmpresaDetailsProps {
  currentConvenenteId: string | null;
  formData: ConvenenteData;
  formMode: 'view' | 'create' | 'edit';
  isLoading: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
  onNewConvenente: () => void;
}

const EmpresaDetails: React.FC<EmpresaDetailsProps> = ({
  currentConvenenteId,
  formData,
  formMode,
  isLoading,
  onEdit,
  onDelete,
  onViewDetails,
  onNewConvenente
}) => {
  if (!currentConvenenteId) {
    return (
      <div className="md:col-span-2">
        <div className="flex flex-col items-center justify-center h-full p-10 rounded-lg border border-dashed text-foreground bg-muted border-border">
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhum convenente selecionado</h3>
          <p className="text-muted-foreground text-center mb-4">
            Selecione um convenente da lista ou crie um novo para visualizar os detalhes
          </p>
          <Button onClick={onNewConvenente} className="bg-primary-blue hover:bg-primary-blue/90">
            <Plus size={16} className="mr-2" />
            Criar Nova Empresa
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="md:col-span-2">
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-foreground">
            {formData.razaoSocial}
          </h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEdit} 
              disabled={formMode === 'edit' || isLoading}
            >
              <Pencil size={16} className="mr-2" />
              Editar
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={onDelete} 
              disabled={isLoading}
            >
              <Trash2 size={16} className="mr-2" />
              Excluir
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-foreground">
          <div>
            <strong>CNPJ:</strong> {formatCNPJ(formData.cnpj)}
          </div>
          <div>
            <strong>Cidade/UF:</strong> {formData.cidade}/{formData.uf}
          </div>
          <div>
            <strong>Contato:</strong> {formData.contato}
          </div>
          <div>
            <strong>Email:</strong> {formData.email}
          </div>
          <div>
            <strong>Telefone:</strong> {formData.fone}
          </div>
          <div>
            <strong>Celular:</strong> {formData.celular}
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="mt-4 w-full border-border text-foreground" 
          onClick={onViewDetails}
        >
          Ver detalhes completos
        </Button>
      </div>
    </div>
  );
};

export default EmpresaDetails;
