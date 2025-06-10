
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Settings, Trash2 } from "lucide-react";

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
  if (selectedFavorecidos.length === 0) return null;

  const handleGenerateReportClick = () => {
    console.log("=== 📊 SelectedFavorecidosActions - handleGenerateReportClick ===");
    console.log("Chamando onGenerateReport que deve abrir o dialog de ordenação");
    onGenerateReport();
  };

  return (
    <div className="sticky bottom-0 bg-background border-t border-border p-4 shadow-lg">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="font-medium">
              {selectedFavorecidos.length} favorecido(s) selecionado(s)
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={onClearSelection}
            size="sm"
            className="gap-2"
          >
            <Trash2 size={16} />
            Limpar Seleção
          </Button>
          
          <Button 
            onClick={handleGenerateReportClick}
            disabled={!hasConvenente}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <FileText size={16} />
            Gerar Relatório
          </Button>
          
          <Button 
            onClick={onProcessSelected}
            size="sm"
            className="gap-2"
          >
            <Settings size={16} />
            Processar Selecionados
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectedFavorecidosActions;
