import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileCheck, Download, X, FileOutput, FileText } from "lucide-react";
import { SelectedRecordsCounter } from "./SelectedRecordsCounter";
interface TableViewHeaderProps {
  selectedCount: number;
  validationPerformed: boolean;
  hasValidationErrors: boolean;
  cnabFileGenerated: boolean;
  onBack: () => void;
  onVerifyErrors: () => void;
  onExportErrors: () => void;
  onClearSelection: () => void;
  onProcessSelected: () => void;
  onGenerateReport: () => void;
}
const TableViewHeader: React.FC<TableViewHeaderProps> = ({
  selectedCount,
  validationPerformed,
  hasValidationErrors,
  cnabFileGenerated,
  onBack,
  onVerifyErrors,
  onExportErrors,
  onClearSelection,
  onProcessSelected,
  onGenerateReport
}) => {
  return <div className="flex justify-between items-center mb-4 p-4 bg-muted/30 rounded-lg border">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center">
          <ChevronLeft className="mr-1 h-4 w-4" /> Voltar
        </Button>
        
        <SelectedRecordsCounter selectedCount={selectedCount} />
      </div>

      <div className="flex gap-3 items-center">
        <Button variant="outline" onClick={onVerifyErrors} className="flex items-center text-red-600">
          <FileCheck className="mr-2 h-4 w-4" />
          Verificar Erros
        </Button>

        {validationPerformed && hasValidationErrors && <Button variant="outline" onClick={onExportErrors} className="flex items-center text-amber-600">
            <Download className="mr-2 h-4 w-4" />
            Exportar Erros
          </Button>}

        {selectedCount > 0 && <Button variant="outline" onClick={onClearSelection} className="flex items-center text-gray-600 hover:text-gray-800">
            <X className="mr-2 h-4 w-4" />
            Limpar Seleção
          </Button>}

        <Button onClick={onProcessSelected} className="flex items-center" disabled={selectedCount === 0} title={selectedCount === 0 ? "Selecione pelo menos um registro para processar" : `Processar ${selectedCount} registro${selectedCount !== 1 ? 's' : ''} selecionado${selectedCount !== 1 ? 's' : ''}`}>
          <FileOutput className="mr-2 h-4 w-4" />
          Processar Selecionados
        </Button>
        
        <Button onClick={onGenerateReport} className="flex items-center" disabled={!cnabFileGenerated} title={!cnabFileGenerated ? "Gere o arquivo CNAB antes de visualizar o relatório" : "Gerar relatório PDF dos registros válidos"}>
          <FileText className="mr-2 h-4 w-4" />
          Gerar Relatório
        </Button>
      </div>
    </div>;
};
export default TableViewHeader;