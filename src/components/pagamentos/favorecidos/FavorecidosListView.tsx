
import React from 'react';
import { Loader2 } from "lucide-react";
import FavorecidosTable from "@/components/favorecidos/FavorecidosTable";
import FavorecidosSearchBar, { EmptyState } from "./FavorecidosSearchBar";

interface FavorecidosListViewProps {
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
}

const FavorecidosListView: React.FC<FavorecidosListViewProps> = ({
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
  hideTipoColumn = false
}) => {
  const hasResults = filteredFavorecidos.length > 0;

  return (
    <div className="space-y-6">
      <FavorecidosSearchBar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        hasResults={hasResults}
        resultCount={filteredFavorecidos.length}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : hasResults ? (
        <div className="bg-background border rounded-lg p-4">
          <FavorecidosTable
            favorecidos={filteredFavorecidos}
            onEdit={onEdit}
            onDelete={onDelete}
            onSelectFavorecido={onSelectFavorecido}
            selectedFavorecidos={selectedFavorecidos}
            onSelectionChange={onSelectionChange}
            showActions={true}
            hidePixColumn={hidePixColumn}
            hideBankColumn={hideBankColumn}
            hideTipoColumn={hideTipoColumn}
            itemsPerPage={10}
          />
        </div>
      ) : (
        <div className="bg-background border rounded-lg">
          <EmptyState searchTerm={searchTerm} />
        </div>
      )}
    </div>
  );
};

export default FavorecidosListView;
