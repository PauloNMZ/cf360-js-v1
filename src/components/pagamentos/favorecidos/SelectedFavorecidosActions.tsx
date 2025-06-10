
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Users, Trash2 } from "lucide-react";

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
  console.log("=== 🎯 SelectedFavorecidosActions RENDER ===");
  console.log("selectedFavorecidos count:", selectedFavorecidos.length);
  console.log("hasConvenente:", hasConvenente);
  console.log("onGenerateReport function:", typeof onGenerateReport);

  const handleGenerateReportClick = () => {
    console.log("=== 🚀 SelectedFavorecidosActions - Generate Report Button CLICKED ===");
    console.log("About to call onGenerateReport");
    console.log("onGenerateReport type:", typeof onGenerateReport);
    onGenerateReport();
    console.log("onGenerateReport called successfully");
  };

  const handleProcessSelectedClick = () => {
    console.log("=== 🚀 SelectedFavorecidosActions - Process Selected Button CLICKED ===");
    console.log("About to call onProcessSelected");
    onProcessSelected();
  };

  if (selectedFavorecidos.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border-l-4 border-primary">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <span className="font-medium text-gray-900 dark:text-white">
            {selectedFavorecidos.length} favorecido(s) selecionado(s)
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Limpar Seleção
        </Button>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleGenerateReportClick}
          className="flex items-center gap-2"
          variant="outline"
        >
          <FileText className="h-4 w-4" />
          Gerar Relatório
        </Button>

        <Button
          onClick={handleProcessSelectedClick}
          disabled={!hasConvenente}
          className="flex items-center gap-2"
          title={!hasConvenente ? "É necessário selecionar um convenente no workflow" : ""}
        >
          <Users className="h-4 w-4" />
          Processar Selecionados
        </Button>
      </div>

      {!hasConvenente && (
        <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
          ⚠️ Para processar os favorecidos, é necessário configurar um convenente no workflow.
        </p>
      )}
    </div>
  );
};

export default SelectedFavorecidosActions;
