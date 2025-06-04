
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ImportacaoSearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasResults: boolean;
  resultCount?: number;
}

const ImportacaoSearchBar: React.FC<ImportacaoSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  hasResults,
  resultCount = 0,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
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

export default ImportacaoSearchBar;
