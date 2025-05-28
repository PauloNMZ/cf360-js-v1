
import { useState } from "react";
import { FavorecidoData, emptyFavorecido } from "@/types/favorecido";
import { 
  getFavorecidos, 
  saveFavorecido, 
  updateFavorecido, 
  deleteFavorecido,
  searchFavorecidosByTerm
} from "@/services/favorecido/favorecidoService";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useFavorecidos = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFavorecido, setCurrentFavorecido] = useState<FavorecidoData>({...emptyFavorecido});
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [favorecidoToDelete, setFavorecidoToDelete] = useState<string | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // Debug logs for modal states
  console.log("useFavorecidos - Current states:", {
    modalOpen,
    deleteDialogOpen,
    currentFavorecido: currentFavorecido.id,
    formMode,
    favorecidoToDelete
  });

  // Query to fetch favorecidos
  const { 
    data: favorecidos = [], 
    isLoading: isLoadingFavorecidos,
    refetch
  } = useQuery({
    queryKey: ['favorecidos'],
    queryFn: getFavorecidos
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
      setModalOpen(false);
      setSuccessModalOpen(true);
      queryClient.invalidateQueries({ queryKey: ['favorecidos'] });
    },
    onError: (error, variables) => {
      const { mode } = variables;
      console.error(`Erro ao ${mode === 'create' ? 'criar' : 'atualizar'} favorecido:`, error);
      toast.error(`Erro ao ${mode === 'create' ? 'criar' : 'atualizar'} favorecido`);
    }
  });

  // Mutation for deleting favorecidos
  const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      return await deleteFavorecido(id);
    },
    onSuccess: () => {
      toast.success("Favorecido excluído com sucesso");
      queryClient.invalidateQueries({ queryKey: ['favorecidos'] });
      setDeleteDialogOpen(false);
      setFavorecidoToDelete(null);
    },
    onError: (error) => {
      console.error("Erro ao excluir favorecido:", error);
      toast.error("Erro ao excluir favorecido");
    }
  });

  // Create new favorecido
  const handleCreateNew = () => {
    console.log("useFavorecidos - handleCreateNew called");
    setCurrentFavorecido({...emptyFavorecido});
    setFormMode('create');
    setModalOpen(true);
    console.log("useFavorecidos - After handleCreateNew, modalOpen should be true:", true);
  };

  // Edit favorecido
  const handleEdit = (favorecido: FavorecidoData & { id: string }) => {
    console.log("useFavorecidos - handleEdit called with:", favorecido);
    setCurrentFavorecido({...favorecido});
    setFormMode('edit');
    setModalOpen(true);
    console.log("useFavorecidos - After handleEdit, modalOpen should be true, currentFavorecido:", favorecido.nome);
  };

  // Delete favorecido
  const handleDelete = (id: string) => {
    console.log("useFavorecidos - handleDelete called with ID:", id);
    setFavorecidoToDelete(id);
    setDeleteDialogOpen(true);
    console.log("useFavorecidos - After handleDelete, deleteDialogOpen should be true");
  };

  // Confirm delete
  const confirmDelete = async () => {
    console.log("useFavorecidos - confirmDelete called for favorecido:", favorecidoToDelete);
    if (!favorecidoToDelete) return;
    deleteMutation(favorecidoToDelete);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentFavorecido(prev => ({ ...prev, [name]: value }));
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setCurrentFavorecido(prev => ({ ...prev, [name]: value }));
  };

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Save favorecido
  const handleSave = async () => {
    console.log("useFavorecidos - handleSave called");
    // Basic validation
    if (!currentFavorecido.nome.trim() || !currentFavorecido.inscricao.trim()) {
      toast.error("Nome e Inscrição são campos obrigatórios");
      return;
    }

    saveMutation({ favorecido: currentFavorecido, mode: formMode });
  };

  const isLoading = isLoadingFavorecidos || isSearching || isSaving || isDeleting;

  return {
    favorecidos,
    filteredFavorecidos,
    isLoading,
    searchTerm,
    modalOpen,
    currentFavorecido,
    formMode,
    deleteDialogOpen,
    favorecidoToDelete,
    successModalOpen,
    handleCreateNew,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleInputChange,
    handleSelectChange,
    handleSearchChange,
    handleSave,
    setModalOpen,
    setDeleteDialogOpen,
    setSuccessModalOpen,
    refetch,
  };
};
