
import { supabase, searchConvenentes } from "@/integrations/supabase/client";
import type { ConvenenteData } from "@/types/convenente";

// Function to search convenentes by term (using the Supabase RPC function)
export const searchConvenentesByTerm = async (searchTerm: string): Promise<Array<ConvenenteData & { id: string }>> => {
  try {
    const { data, error } = await searchConvenentes(searchTerm);
    
    if (error) {
      console.error("Erro na busca de convenentes:", error);
      throw new Error(error.message || "Erro ao buscar convenentes");
    }
    
    // Map the results from the database format to our app's format
    return (data || []).map(item => ({
      id: item.id,
      razaoSocial: item.razao_social,
      cnpj: item.cnpj,
      endereco: "",
      numero: "",
      complemento: "",
      uf: "",
      cidade: "",
      contato: "",
      fone: "",
      celular: "",
      email: "",
      agencia: "",
      conta: "",
      chavePix: "",
      convenioPag: ""
    }));
  } catch (error) {
    console.error("Erro ao executar busca:", error);
    throw error;
  }
};
