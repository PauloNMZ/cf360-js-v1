
import { ConvenenteData } from "@/types/convenente";
import { 
  saveConvenente as apiSaveConvenente, 
  updateConvenente as apiUpdateConvenente,
  deleteConvenente as apiDeleteConvenente,
  getConvenentes as apiGetConvenentes
} from "./convenenteApi";

// Higher-level service functions
export const createConvenente = async (formData: ConvenenteData): Promise<ConvenenteData & { id: string }> => {
  // Add any business logic here before saving
  return await apiSaveConvenente(formData);
};

export const updateConvenenteData = async (id: string, formData: ConvenenteData): Promise<(ConvenenteData & { id: string }) | null> => {
  // Add any business logic here before updating
  return await apiUpdateConvenente(id, formData);
};

export const removeConvenente = async (id: string): Promise<boolean> => {
  // Add any business logic here before deleting
  return await apiDeleteConvenente(id);
};

export const fetchConvenentes = async (): Promise<Array<ConvenenteData & { id: string }>> => {
  // Add any business logic here before fetching
  return await apiGetConvenentes();
};

// Re-export the API functions for direct access if needed
export { 
  searchConvenentesByTerm,
  getConvenentes,
  getConvenenteById,
  saveConvenente,
  updateConvenente,
  deleteConvenente
} from "./convenenteApi";
