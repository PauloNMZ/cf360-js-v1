
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle } from "lucide-react";

interface FavorecidosSearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasResults: boolean;
  resultCount?: number;
}

const FavorecidosSearchBar: React.FC<FavorecidosSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  hasResults,
  resultCount = 0,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Buscar por nome ou inscrição..."
          value={searchTerm}
          onChange={onSearchChange}
          className="pl-10"
        />
      </div>
      {searchTerm && (
        <div className="text-sm text-muted-foreground ml-4">
          {hasResults ? `${resultCount} resultado(s) encontrado(s)` : 'Nenhum resultado'}
        </div>
      )}
    </div>
  );
};

export const EmptyState: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
      <AlertCircle size={40} className="mb-2 text-gray-400" />
      {searchTerm ? (
        <p>Nenhum resultado para "{searchTerm}"</p>
      ) : (
        <p>Nenhum favorecido cadastrado</p>
      )}
    </div>
  );
};

export default FavorecidosSearchBar;
