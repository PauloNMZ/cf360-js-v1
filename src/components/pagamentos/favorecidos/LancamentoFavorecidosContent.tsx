
import React from 'react';
import FavorecidosHeader from "./FavorecidosHeader";
import SelectedFavorecidoView from "./SelectedFavorecidoView";
import FavorecidosListView from "./FavorecidosListView";
import SelectedFavorecidosActions from "./SelectedFavorecidosActions";

interface LancamentoFavorecidosContentProps {
  selectedFavorecido: any;
  onCancelSelection: () => void;
  onCreateNew: () => void;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  filteredFavorecidos: any[];
  onEdit: (favorecido: any) => void;
  onDelete: (id: string) => void;
  onSelectFavorecido: (favorecido: any) => void;
  selectedFavorecidos: string[];
  onSelectionChange: (selection: string[]) => void;
  hidePixColumn?: boolean;
  hideBankColumn?: boolean;
  hideTipoColumn?: boolean;
  hasConvenente: boolean;
  onClearSelection: () => void;
  onGenerateReport: () => void;
  onProcessSelected: () => void;
}

const LancamentoFavorecidosContent: React.FC<LancamentoFavorecidosContentProps> = ({
  selectedFavorecido,
  onCancelSelection,
  onCreateNew,
  searchTerm,
  onSearchChange,
  isLoading,
  filteredFavorecidos,
  onEdit,
  onDelete,
  onSelectFavorecido,
  selectedFavorecidos,
  onSelectionChange,
  hidePixColumn = false,
  hideBankColumn = false,
  hideTipoColumn = false,
  hasConvenente,
  onClearSelection,
  onGenerateReport,
  onProcessSelected
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <FavorecidosHeader onCreateNew={onCreateNew} />

      {selectedFavorecido ? (
        // Selected Favorecido View
        <SelectedFavorecidoView
          selectedFavorecido={selectedFavorecido}
          onCancelSelection={onCancelSelection}
        />
      ) : (
        <>
          {/* List View */}
          <FavorecidosListView
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            isLoading={isLoading}
            filteredFavorecidos={filteredFavorecidos}
            onEdit={onEdit}
            onDelete={onDelete}
            onSelectFavorecido={onSelectFavorecido}
            selectedFavorecidos={selectedFavorecidos}
            onSelectionChange={onSelectionChange}
            hidePixColumn={hidePixColumn}
            hideBankColumn={hideBankColumn}
            hideTipoColumn={hideTipoColumn}
          />

          {/* Actions */}
          <SelectedFavorecidosActions
            selectedFavorecidos={selectedFavorecidos}
            hasConvenente={hasConvenente}
            onClearSelection={onClearSelection}
            onGenerateReport={onGenerateReport}
            onProcessSelected={onProcessSelected}
          />
        </>
      )}
    </div>
  );
};

export default LancamentoFavorecidosContent;
