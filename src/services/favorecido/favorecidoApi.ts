
import { FavorecidoData } from "@/types/favorecido";
import { supabase } from "@/integrations/supabase/client";

/**
 * Get all favorecidos for the current user
 */
export const getFavorecidos = async (): Promise<Array<FavorecidoData & { id: string }>> => {
  const { data: favorecidos, error } = await supabase
    .from("favorecidos")
    .select("*")
    .order("nome", { ascending: true });

  if (error) {
    console.error("Erro ao buscar favorecidos:", error);
    throw new Error(`Erro ao buscar favorecidos: ${error.message}`);
  }

  return favorecidos || [];
};

/**
 * Get a favorecido by ID
 */
export const getFavorecidoById = async (id: string): Promise<(FavorecidoData & { id: string }) | null> => {
  const { data, error } = await supabase
    .from("favorecidos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erro ao buscar favorecido:", error);
    throw new Error(`Erro ao buscar favorecido: ${error.message}`);
  }

  return data;
};

/**
 * Search favorecidos by term
 */
export const searchFavorecidosByTerm = async (term: string): Promise<Array<FavorecidoData & { id: string }>> => {
  if (!term || term.trim() === "") {
    return await getFavorecidos();
  }

  const searchTerm = term.trim().toLowerCase();
  const { data, error } = await supabase
    .from("favorecidos")
    .select("*")
    .or(`nome.ilike.%${searchTerm}%,inscricao.ilike.%${searchTerm}%`)
    .order("nome", { ascending: true });

  if (error) {
    console.error("Erro ao buscar favorecidos:", error);
    throw new Error(`Erro ao buscar favorecidos: ${error.message}`);
  }

  return data || [];
};

/**
 * Save a new favorecido
 */
export const saveFavorecido = async (favorecido: FavorecidoData): Promise<FavorecidoData & { id: string }> => {
  const { data, error } = await supabase
    .from("favorecidos")
    .insert([favorecido])
    .select()
    .single();

  if (error) {
    console.error("Erro ao salvar favorecido:", error);
    throw new Error(`Erro ao salvar favorecido: ${error.message}`);
  }

  return data;
};

/**
 * Update an existing favorecido
 */
export const updateFavorecido = async (id: string, favorecido: FavorecidoData): Promise<(FavorecidoData & { id: string }) | null> => {
  const { data, error } = await supabase
    .from("favorecidos")
    .update(favorecido)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar favorecido:", error);
    throw new Error(`Erro ao atualizar favorecido: ${error.message}`);
  }

  return data;
};

/**
 * Delete a favorecido
 */
export const deleteFavorecido = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("favorecidos")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao excluir favorecido:", error);
    throw new Error(`Erro ao excluir favorecido: ${error.message}`);
  }

  return true;
};
