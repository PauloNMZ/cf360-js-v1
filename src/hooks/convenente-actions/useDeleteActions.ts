
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";
import { removeConvenente, fetchConvenentes } from "@/services/convenente/convenenteService";

export const useDeleteActions = (
  {
    setFormMode,
    setFormData,
    setConvenentes,
    currentConvenenteId,
    setCurrentConvenenteId,
    setIsLoading
  }: {
    setFormMode: (mode: 'view' | 'create' | 'edit') => void;
    setFormData: (data: ConvenenteData) => void;
    setConvenentes: (convenentes: Array<ConvenenteData & { id: string }>) => void;
    currentConvenenteId: string | null;
    setCurrentConvenenteId: (id: string | null) => void;
    setIsLoading: (loading: boolean) => void;
  }
) => {
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (!currentConvenenteId) {
      toast({
        title: "Nenhum convenente selecionado",
        description: "Selecione um convenente da lista para excluir.",
        variant: "destructive",
      });
      return;
    }
    
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (currentConvenenteId) {
      try {
        setIsDeleting(true);
        setIsLoading(true);
        
        const success = await removeConvenente(currentConvenenteId);
        
        if (success) {
          toast({
            title: "Convenente excluído",
            description: "O convenente foi excluído com sucesso.",
          });
          
          // Update list after successful deletion
          const updatedConvenentes = await fetchConvenentes();
          setConvenentes(updatedConvenentes);
          setCurrentConvenenteId(null);
          setFormData({...emptyConvenente});
          setFormMode('view');
          
          // Close the dialog after successful deletion
          setShowDeleteDialog(false);
        } else {
          throw new Error("Falha ao excluir convenente");
        }
      } catch (error) {
        console.error("Erro ao excluir:", error);
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o convenente.",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
        setIsLoading(false);
      }
    } else {
      setShowDeleteDialog(false);
    }
  };

  return {
    showDeleteDialog,
    setShowDeleteDialog,
    handleDelete,
    confirmDelete,
    isDeleting
  };
};
