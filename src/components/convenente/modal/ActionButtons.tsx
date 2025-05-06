
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, Plus, Save, TrashIcon } from "lucide-react";

interface ActionButtonsProps {
  formMode: 'view' | 'create' | 'edit';
  currentConvenenteId: string | null;
  isLoading: boolean;
  isSaveDisabled: boolean;
  onCreateNew: (e: React.MouseEvent) => void;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  formMode,
  currentConvenenteId,
  isLoading,
  isSaveDisabled,
  onCreateNew,
  onEdit,
  onDelete,
  onSave
}) => {
  return (
    <div className="flex justify-between mb-4">
      <div className="flex space-x-2">
        <Button
          onClick={onCreateNew}
          variant="outline"
          className={`flex items-center gap-1 ${formMode === 'create' ? 'bg-blue-100 border-blue-300 font-bold' : ''}`}
          disabled={formMode === 'create'}
        >
          <Plus size={16} /> Novo
        </Button>
        <Button
          onClick={onEdit}
          variant="outline"
          className={`flex items-center gap-1 ${formMode === 'edit' ? 'bg-blue-100 border-blue-300 font-bold' : ''}`}
          disabled={formMode === 'edit' || !currentConvenenteId}
        >
          <Edit size={16} /> Editar
        </Button>
        <Button
          onClick={onDelete}
          variant="outline"
          className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
          disabled={!currentConvenenteId}
        >
          <TrashIcon size={16} /> Excluir
        </Button>
      </div>
      {(formMode === 'create' || formMode === 'edit') && (
        <Button
          onClick={onSave}
          variant="default"
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
          disabled={isSaveDisabled}
        >
          <Save size={16} /> Salvar
          {isLoading && <Loader2 className="ml-2 animate-spin" size={16} />}
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
