
import { useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

interface UseDebounceSearchProps {
  isLoading: boolean;
  onSearch: (value: string) => void;
}

/**
 * Hook to provide debounced search functionality
 */
export const useDebounceSearch = ({ isLoading, onSearch }: UseDebounceSearchProps) => {
  const { toast } = useToast();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSearchRef = useRef("");
  const isSearchPendingRef = useRef(false);
  
  /**
   * Executes a debounced search
   */
  const debounceSearch = useCallback((value: string) => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Don't allow multiple searches to be triggered
    if (isLoading || isSearchPendingRef.current) {
      console.log("Search already in progress, ignoring request");
      return;
    }
    
    // Remove non-numeric characters
    const cleanValue = value.replace(/\D/g, '');
    
    // Check if there's input before querying
    if (!cleanValue) {
      toast({
        title: "Campo vazio",
        description: "Digite um CNPJ para pesquisar.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if this value was just searched
    if (cleanValue === lastSearchRef.current) {
      console.log("Value was just searched, ignoring duplicate request");
      return;
    }
    
    // Set a flag to prevent repeated searches
    isSearchPendingRef.current = true;
    lastSearchRef.current = cleanValue;
    
    console.log("Initiating search for:", cleanValue);
    
    // Add a small delay before actually triggering the search
    searchTimeoutRef.current = setTimeout(() => {
      onSearch(cleanValue);
    }, 300);
  }, [isLoading, toast, onSearch]);
  
  const setSearchPending = (isPending: boolean) => {
    isSearchPendingRef.current = isPending;
  };
  
  return {
    debounceSearch,
    setSearchPending,
    isSearchPendingRef
  };
};
