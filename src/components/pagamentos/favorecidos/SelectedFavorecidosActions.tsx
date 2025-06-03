
import React from 'react';
import { Button } from "@/components/ui/button";

interface SelectedFavorecidosActionsProps {
  selectedFavorecidos: string[];
  hasConvenente: boolean;
  onClearSelection: () => void;
  onGenerateReport: () => void;
  onProcessSelected: () => void;
}

const SelectedFavorecidosActions: React.FC<SelectedFavorecidosActionsProps> = ({
  selectedFavorecidos,
  hasConvenente,
  onClearSelection,
  onGenerateReport,
  onProcessSelected
}) => {
  return (
    <div className="flex gap-4 items-center p-4 border rounded-md bg-muted/50">
      <span className="text-sm text-muted-foreground">
        {selectedFavorecidos.length} favorecido(s) selecionado(s)
      </span>
      
      <div className="flex gap-2 ml-auto">
        {selectedFavorecidos.length > 0 && (
          <Button 
            variant="outline" 
            onClick={onClearSelection}
            size="sm"
          >
            Limpar Seleção
          </Button>
        )}
        
        <Button 
          onClick={onGenerateReport}
          disabled={selectedFavorecidos.length === 0 || !hasConvenente}
          variant="outline"
          size="sm"
        >
          Gerar Relatório
        </Button>
        
        <Button 
          onClick={onProcessSelected}
          disabled={selectedFavorecidos.length === 0}
          size="sm"
        >
          Processar Selecionados
        </Button>
      </div>
    </div>
  );
};

export default SelectedFavorecidosActions;
