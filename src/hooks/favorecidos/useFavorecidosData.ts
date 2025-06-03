
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getFavorecidos, 
  searchFavorecidosByTerm
} from "@/services/favorecido/favorecidoService";
import { useGroupOperations } from "@/services/group/hooks";

export const useFavorecidosData = (searchTerm: string) => {
  const { fetchGroups } = useGroupOperations();

  // Query to fetch favorecidos
  const { 
    data: favorecidos = [], 
    isLoading: isLoadingFavorecidos,
    refetch
  } = useQuery({
    queryKey: ['favorecidos'],
    queryFn: getFavorecidos
  });

  // Query to fetch groups
  const { 
    data: grupos = [], 
    isLoading: isLoadingGroups 
  } = useQuery({
    queryKey: ['grupos'],
    queryFn: fetchGroups
  });

  // Query for searched favorecidos
  const {
    data: searchResults = [],
    isLoading: isSearching,
  } = useQuery({
    queryKey: ['favorecidos', 'search', searchTerm],
    queryFn: () => searchFavorecidosByTerm(searchTerm),
    enabled: searchTerm.length > 0,
  });

  // Filtered favorecidos based on search term
  const filteredFavorecidos = searchTerm.length > 0 ? searchResults : favorecidos;

  const isLoading = isLoadingFavorecidos || isSearching || isLoadingGroups;

  return {
    favorecidos,
    grupos,
    filteredFavorecidos,
    isLoading,
    refetch
  };
};
