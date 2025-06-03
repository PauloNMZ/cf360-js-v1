
import { useNotificationModalContext } from "@/components/ui/NotificationModalProvider";
import { useFavorecidosData } from "./useFavorecidosData";
import { useFavorecidosMutations } from "./useFavorecidosMutations";
import { useFavorecidosState } from "./useFavorecidosState";
import { useFavorecidosActions } from "./useFavorecidosActions";
import { useFavorecidosHandlers } from "./useFavorecidosHandlers";

export const useFavorecidos = () => {
  // State management
  const {
    searchTerm,
    setSearchTerm,
    modalOpen,
    setModalOpen,
    currentFavorecido,
    setCurrentFavorecido,
    formMode,
    setFormMode,
    deleteDialogOpen,
    setDeleteDialogOpen,
    favorecidoToDelete,
    setFavorecidoToDelete
  } = useFavorecidosState();

  // Data fetching
  const {
    favorecidos,
    grupos,
    filteredFavorecidos,
    isLoading: isDataLoading,
    refetch
  } = useFavorecidosData(searchTerm);

  // Mutations
  const {
    saveMutation,
    deleteMutation,
    isSaving,
    isDeleting
  } = useFavorecidosMutations();

  // Notification modal - using context instead of hook
  const { showSuccess, showError, showWarning, showInfo } = useNotificationModalContext();

  // Actions
  const {
    handleCreateNew,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleSave
  } = useFavorecidosActions({
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
  });

  // Handlers
  const {
    handleInputChange,
    handleSelectChange,
    handleSearchChange
  } = useFavorecidosHandlers({
    setCurrentFavorecido,
    setSearchTerm
  });

  const isLoading = isDataLoading || isSaving || isDeleting;

  return {
    favorecidos,
    grupos,
    filteredFavorecidos,
    isLoading,
    searchTerm,
    modalOpen,
    currentFavorecido,
    formMode,
    deleteDialogOpen,
    favorecidoToDelete,
    notificationModalOpen: false, // Legacy compatibility
    notificationConfig: { type: 'success' as const, title: '', message: '', buttonText: 'OK' }, // Legacy compatibility
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
    setNotificationModalOpen: () => {}, // Legacy compatibility
    refetch,
  };
};
