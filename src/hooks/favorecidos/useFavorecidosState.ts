
import { useState } from "react";
import { FavorecidoData, emptyFavorecido } from "@/types/favorecido";

export const useFavorecidosState = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFavorecido, setCurrentFavorecido] = useState<FavorecidoData>({...emptyFavorecido});
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [favorecidoToDelete, setFavorecidoToDelete] = useState<string | null>(null);

  // Debug logs for modal states
  console.log("useFavorecidosState - Current states:", {
    modalOpen,
    deleteDialogOpen,
    currentFavorecido: currentFavorecido.id,
    formMode,
    favorecidoToDelete
  });

  return {
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
  };
};
