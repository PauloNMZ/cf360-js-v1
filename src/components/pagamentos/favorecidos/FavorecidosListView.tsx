
import React from 'react';
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import FavorecidosTable from "@/components/favorecidos/FavorecidosTable";

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
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Buscar favorecidos..."
          value={searchTerm}
          onChange={onSearchChange}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <FavorecidosTable
          favorecidos={filteredFavorecidos}
          onEdit={onEdit}
          onDelete={onDelete}
          onSelectFavorecido={onSelectFavorecido}
          selectedFavorecidos={selectedFavorecidos}
          onSelectionChange={onSelectionChange}
          showActions={false}
          hidePixColumn={hidePixColumn}
          hideBankColumn={hideBankColumn}
          hideTipoColumn={hideTipoColumn}
          itemsPerPage={10}
        />
      )}
    </div>
  );
};

export default FavorecidosListView;
