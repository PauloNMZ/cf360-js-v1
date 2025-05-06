
import React from "react";
import { AlertCircle, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ConvenenteData } from "@/types/convenente";
import { formatCNPJ } from "@/utils/formValidation";

interface ConvenenteListProps {
  convenentes: Array<ConvenenteData & { id: string }>;
  filteredConvenentes: Array<ConvenenteData & { id: string }>;
  currentConvenenteId: string | null;
  isLoading: boolean;
  isSearching?: boolean;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectConvenente: (convenente: ConvenenteData & { id: string }) => void;
}

const ConvenenteList: React.FC<ConvenenteListProps> = ({
  filteredConvenentes,
  currentConvenenteId,
  isLoading,
  isSearching = false,
  searchTerm,
  onSearchChange,
  onSelectConvenente,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Buscar convenentes..." 
            className="pl-10 border-blue-200 focus:border-blue-500"
            value={searchTerm}
            onChange={onSearchChange}
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-blue-500" size={18} />
          )}
        </div>
      </div>
      
      <div className="h-[500px] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            Carregando...
          </div>
        ) : filteredConvenentes.length > 0 ? (
          <ul className="space-y-2">
            {filteredConvenentes.map((convenente) => (
              <li 
                key={convenente.id}
                onClick={() => onSelectConvenente(convenente)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  currentConvenenteId === convenente.id 
                    ? 'bg-blue-100 border border-blue-300' 
                    : 'hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <h3 className="font-medium text-blue-800">{convenente.razaoSocial}</h3>
                <p className="text-sm text-gray-500">
                  CNPJ: {formatCNPJ(convenente.cnpj)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <AlertCircle size={40} className="mb-2 text-blue-400" />
            {searchTerm ? (
              <p>Nenhum resultado para "{searchTerm}"</p>
            ) : (
              <p>Nenhum convenente cadastrado</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConvenenteList;
