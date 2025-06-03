
import { useState, useEffect, useCallback } from "react";
import { ConvenenteData } from "@/types/convenente";
import { searchConvenentesByTerm } from "@/services/convenente/convenenteApi";

export const useConvenenteSearch = (convenentes: Array<ConvenenteData & { id: string }>) => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConvenentes, setFilteredConvenentes] = useState<Array<ConvenenteData & { id: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Use database search function when search term changes
  useEffect(() => {
    const searchConvenentes = async () => {
      // Minimum search length check
      if (!searchTerm || searchTerm.trim().length < 1) {
        // If search is cleared, reset to all convenentes
        setFilteredConvenentes(convenentes);
        return;
      }

      setIsSearching(true);
      try {
        console.log("Searching for:", searchTerm);
        const searchResults = await searchConvenentesByTerm(searchTerm);
        console.log("Search results:", searchResults.length);
        setFilteredConvenentes(searchResults);
      } catch (error) {
        console.error("Erro na pesquisa:", error);
        // If search fails, fallback to all convenentes
        setFilteredConvenentes(convenentes);
      } finally {
        setIsSearching(false);
      }
    };

    // Use a small delay to prevent excessive API calls
    const timeoutId = setTimeout(() => {
      searchConvenentes();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, convenentes]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return {
    searchTerm,
    filteredConvenentes,
    isSearching,
    handleSearchChange
  };
};
