
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  saveFavorecido, 
  updateFavorecido, 
  deleteFavorecido
} from "@/services/favorecido/favorecidoService";
import { FavorecidoData } from "@/types/favorecido";
import { toast } from "sonner";
import { useSuccessModal } from "@/hooks/useSuccessModal";

export const useFavorecidosMutations = () => {
  const queryClient = useQueryClient();
  const { showSuccess } = useSuccessModal();

  // Mutation for creating/updating favorecidos
  const { mutate: saveMutation, isPending: isSaving } = useMutation({
    mutationFn: async (data: { favorecido: FavorecidoData; mode: 'create' | 'edit' }) => {
      const { favorecido, mode } = data;
      if (mode === 'create') {
        return await saveFavorecido(favorecido);
      } else {
        if (!favorecido.id) throw new Error("Favorecido ID is required for updates");
        return await updateFavorecido(favorecido.id, favorecido);
      }
    },
    onSuccess: (_, variables) => {
      const { mode } = variables;
      showSuccess(
        "Sucesso!",
        mode === 'create' ? "Favorecido cadastrado com sucesso." : "Favorecido atualizado com sucesso.",
        "OK"
      );
      queryClient.invalidateQueries({ queryKey: ['favorecidos'] });
    },
    onError: (error, variables) => {
      const { mode } = variables;
      console.error(`Erro ao ${mode === 'create' ? 'criar' : 'atualizar'} favorecido:`, error);
      toast.error(`Erro ao ${mode === 'create' ? 'criar' : 'atualizar'} favorecido`);
    }
  });

  // Delete favorecido
  const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      return await deleteFavorecido(id);
    },
    onSuccess: () => {
      showSuccess("Sucesso!", "Favorecido excluído com sucesso.", "OK");
      queryClient.invalidateQueries({ queryKey: ['favorecidos'] });
    },
    onError: (error) => {
      console.error("Erro ao excluir favorecido:", error);
      toast.error("Erro ao excluir favorecido");
    }
  });

  return {
    saveMutation,
    deleteMutation,
    isSaving,
    isDeleting
  };
};
