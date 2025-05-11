
import { FavorecidoData } from "@/types/favorecido";
import { 
  saveFavorecido as apiSaveFavorecido, 
  updateFavorecido as apiUpdateFavorecido,
  deleteFavorecido as apiDeleteFavorecido,
  getFavorecidos as apiGetFavorecidos
} from "./favorecidoApi";

// Higher-level service functions
export const createFavorecido = async (formData: FavorecidoData): Promise<FavorecidoData & { id: string }> => {
  return await apiSaveFavorecido(formData);
};

export const updateFavorecidoData = async (id: string, formData: FavorecidoData): Promise<(FavorecidoData & { id: string }) | null> => {
  return await apiUpdateFavorecido(id, formData);
};

export const removeFavorecido = async (id: string): Promise<boolean> => {
  return await apiDeleteFavorecido(id);
};

export const fetchFavorecidos = async (): Promise<Array<FavorecidoData & { id: string }>> => {
  return await apiGetFavorecidos();
};

// Re-export the API functions for direct access if needed
export { 
  searchFavorecidosByTerm,
  getFavorecidos,
  getFavorecidoById,
  saveFavorecido,
  updateFavorecido,
  deleteFavorecido
} from "./favorecidoApi";
