
import { FavorecidoData } from "@/types/favorecido";

interface UseFavorecidosHandlersProps {
  setCurrentFavorecido: (favorecido: FavorecidoData | ((prev: FavorecidoData) => FavorecidoData)) => void;
  setSearchTerm: (term: string) => void;
}

export const useFavorecidosHandlers = ({
  setCurrentFavorecido,
  setSearchTerm
}: UseFavorecidosHandlersProps) => {
  
  // Function to determine if inscription is CPF or CNPJ
  const determineTipoInscricao = (inscricao: string): "CPF" | "CNPJ" => {
    const limpo = inscricao.replace(/\D/g, '');
    return limpo.length <= 11 ? "CPF" : "CNPJ";
  };

  // Handle input change with automatic tipo detection
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // If changing inscription, automatically determine the type
    if (name === 'inscricao') {
      const tipoInscricao = determineTipoInscricao(value);
      setCurrentFavorecido(prev => ({ 
        ...prev, 
        [name]: value,
        tipoInscricao
      }));
    } else {
      setCurrentFavorecido(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setCurrentFavorecido(prev => ({ ...prev, [name]: value }));
  };

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return {
    handleInputChange,
    handleSelectChange,
    handleSearchChange
  };
};
