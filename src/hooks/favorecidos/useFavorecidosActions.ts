
import { FavorecidoData, emptyFavorecido } from "@/types/favorecido";
import { useNotificationModal } from "@/hooks/useNotificationModal";

interface UseFavorecidosActionsProps {
  setCurrentFavorecido: (favorecido: FavorecidoData) => void;
  setFormMode: (mode: 'create' | 'edit') => void;
  setModalOpen: (open: boolean) => void;
  setFavorecidoToDelete: (id: string | null) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  currentFavorecido: FavorecidoData;
  formMode: 'create' | 'edit';
  favorecidoToDelete: string | null;
  saveMutation: (data: { favorecido: FavorecidoData; mode: 'create' | 'edit' }) => void;
  deleteMutation: (id: string) => void;
}

export const useFavorecidosActions = ({
  setCurrentFavorecido,
  setFormMode,
  setModalOpen,
  setFavorecidoToDelete,
  setDeleteDialogOpen,
  currentFavorecido,
  formMode,
  favorecidoToDelete,
  saveMutation,
  deleteMutation
}: UseFavorecidosActionsProps) => {
  const { showError } = useNotificationModal();
  
  // Create new favorecido
  const handleCreateNew = () => {
    console.log("useFavorecidosActions - handleCreateNew called");
    setCurrentFavorecido({...emptyFavorecido});
    setFormMode('create');
    setModalOpen(true);
    console.log("useFavorecidosActions - After handleCreateNew, modalOpen should be true:", true);
  };

  // Edit favorecido
  const handleEdit = (favorecido: FavorecidoData & { id: string }) => {
    console.log("useFavorecidosActions - handleEdit called with:", favorecido);
    setCurrentFavorecido({...favorecido});
    setFormMode('edit');
    setModalOpen(true);
    console.log("useFavorecidosActions - After handleEdit, modalOpen should be true, currentFavorecido:", favorecido.nome);
  };

  // Delete favorecido
  const handleDelete = (id: string) => {
    console.log("useFavorecidosActions - handleDelete called with ID:", id);
    setFavorecidoToDelete(id);
    setDeleteDialogOpen(true);
    console.log("useFavorecidosActions - After handleDelete, deleteDialogOpen should be true");
  };

  // Confirm delete
  const confirmDelete = async () => {
    console.log("useFavorecidosActions - confirmDelete called for favorecido:", favorecidoToDelete);
    if (!favorecidoToDelete) return;
    deleteMutation(favorecidoToDelete);
    setDeleteDialogOpen(false);
    setFavorecidoToDelete(null);
  };

  // Save favorecido
  const handleSave = async () => {
    console.log("useFavorecidosActions - handleSave called");
    // Basic validation
    if (!currentFavorecido.nome.trim() || !currentFavorecido.inscricao.trim()) {
      showError("Campos obrigatórios", "Nome e Inscrição são campos obrigatórios");
      return;
    }

    saveMutation({ favorecido: currentFavorecido, mode: formMode });
    setModalOpen(false);
  };

  return {
    handleCreateNew,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleSave
  };
};
