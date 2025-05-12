
import { useState, useEffect } from "react";
import { FavorecidoData, emptyFavorecido } from "@/types/favorecido";
import { 
  getFavorecidos, 
  saveFavorecido, 
  updateFavorecido, 
  deleteFavorecido 
} from "@/services/favorecido/favorecidoService";
import { toast } from "sonner";

export const useFavorecidos = () => {
  const [favorecidos, setFavorecidos] = useState<Array<FavorecidoData & { id: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFavorecidos, setFilteredFavorecidos] = useState<Array<FavorecidoData & { id: string }>>([]);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFavorecido, setCurrentFavorecido] = useState<FavorecidoData>({...emptyFavorecido});
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [favorecidoToDelete, setFavorecidoToDelete] = useState<string | null>(null);

  // Load favorecidos on mount
  useEffect(() => {
    loadFavorecidos();
  }, []);

  // Filter favorecidos when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFavorecidos(favorecidos);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredFavorecidos(favorecidos.filter(f => 
        f.nome.toLowerCase().includes(term) || 
        f.inscricao.toLowerCase().includes(term)
      ));
    }
  }, [searchTerm, favorecidos]);

  const loadFavorecidos = async () => {
    setIsLoading(true);
    try {
      const data = await getFavorecidos();
      setFavorecidos(data);
      setFilteredFavorecidos(data);
    } catch (error) {
      console.error("Erro ao carregar favorecidos:", error);
      toast.error("Erro ao carregar favorecidos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setCurrentFavorecido({...emptyFavorecido});
    setFormMode('create');
    setModalOpen(true);
  };

  const handleEdit = (favorecido: FavorecidoData & { id: string }) => {
    setCurrentFavorecido({...favorecido});
    setFormMode('edit');
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setFavorecidoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!favorecidoToDelete) return;
    
    setIsLoading(true);
    try {
      await deleteFavorecido(favorecidoToDelete);
      toast.success("Favorecido excluído com sucesso");
      loadFavorecidos();
    } catch (error) {
      console.error("Erro ao excluir favorecido:", error);
      toast.error("Erro ao excluir favorecido");
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
      setFavorecidoToDelete(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentFavorecido(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCurrentFavorecido(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSave = async () => {
    // Basic validation
    if (!currentFavorecido.nome.trim() || !currentFavorecido.inscricao.trim()) {
      toast.error("Nome e Inscrição são campos obrigatórios");
      return;
    }

    setIsLoading(true);
    try {
      if (formMode === 'create') {
        await saveFavorecido(currentFavorecido);
        toast.success("Favorecido criado com sucesso");
      } else {
        if (!currentFavorecido.id) return;
        await updateFavorecido(currentFavorecido.id, currentFavorecido);
        toast.success("Favorecido atualizado com sucesso");
      }
      
      loadFavorecidos();
      setModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar favorecido:", error);
      toast.error(`Erro ao ${formMode === 'create' ? 'criar' : 'atualizar'} favorecido`);
    } finally {
      setIsLoading(false);
    }
  };

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
  };
};
