
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileOutput, FileText } from "lucide-react";

interface SelectedFavorecidosActionsProps {
  selectedCount: number;
  onProcessSelected: () => void;
  onGenerateReport: () => void;
  onClearSelection: () => void;
  hasConvenente: boolean;
}

const SelectedFavorecidosActions: React.FC<SelectedFavorecidosActionsProps> = ({
  selectedCount,
  onProcessSelected,
  onGenerateReport,
  onClearSelection,
  hasConvenente
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="mt-4 p-4 border rounded-md bg-background">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">
          {selectedCount} favorecido(s) selecionado(s)
        </h4>
        <div className="flex gap-2">
          <Button
            onClick={onProcessSelected}
            className="flex items-center gap-2"
          >
            <FileOutput size={16} />
            Processar Selecionados
          </Button>
          <Button
            onClick={onGenerateReport}
            variant="outline"
            className="flex items-center gap-2"
            disabled={!hasConvenente}
          >
            <FileText size={16} />
            Gerar Relatório
          </Button>
          <Button variant="outline" size="sm" onClick={onClearSelection}>
            Limpar Seleção
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-muted-foreground">
          Clique em "Processar Selecionados" para gerar arquivo CNAB + relatório, ou "Gerar Relatório" para apenas o relatório.
          {!hasConvenente && (
            <span className="text-orange-600"> (Selecione um convenente primeiro para gerar relatório)</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default SelectedFavorecidosActions;
