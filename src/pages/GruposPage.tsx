
import React, { useState } from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import GruposListaView from "@/components/grupos/GruposListaView";
import GrupoModal from "@/components/grupos/GrupoModal";
import DeleteGrupoDialog from "@/components/grupos/DeleteGrupoDialog";
import GrupoMembrosView from "@/components/grupos/GrupoMembrosView";
import { useGroupOperations } from "@/services/group/hooks";
import { Group, NewGroup } from "@/types/group";
import { toast } from "sonner";

const GruposPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showMembersView, setShowMembersView] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<Group | undefined>(undefined);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { addGroup, editGroup, removeGroup } = useGroupOperations();

  const handleCreateClick = () => {
    setCurrentGroup(undefined);
    setIsCreating(true);
    setModalOpen(true);
  };

  const handleEditClick = (group: Group) => {
    setCurrentGroup(group);
    setIsCreating(false);
    setModalOpen(true);
  };

  const handleDeleteClick = (group: Group) => {
    setCurrentGroup(group);
    setDeleteDialogOpen(true);
  };

  const handleManageMembers = (group: Group) => {
    setCurrentGroup(group);
    setShowMembersView(true);
  };

  const handleBackFromMembers = () => {
    setShowMembersView(false);
    setCurrentGroup(undefined);
  };

  const handleSubmitGroup = async (data: Partial<NewGroup>) => {
    try {
      // Fix: Ensure required field 'nome' is always present
      if (!data.nome && isCreating) {
        toast.error("O nome do grupo é obrigatório");
        return;
      }
      
      if (isCreating) {
        // Make sure nome exists as it's required by the type
        await addGroup(data as Omit<NewGroup, "user_id">);
        toast.success("Grupo criado com sucesso");
      } else if (currentGroup) {
        await editGroup(currentGroup.id, data);
        toast.success("Grupo atualizado com sucesso");
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar grupo:", error);
      toast.error("Erro ao salvar grupo");
    }
  };

  const handleConfirmDelete = async () => {
    if (currentGroup) {
      setIsDeleting(true);
      try {
        await removeGroup(currentGroup.id);
        setDeleteDialogOpen(false);
        toast.success("Grupo excluído com sucesso");
      } catch (error) {
        console.error("Erro ao excluir grupo:", error);
        toast.error("Erro ao excluir grupo");
      } finally {
        setIsDeleting(false);
        setCurrentGroup(undefined);
      }
    }
  };

  return (
    <SidebarLayout>
      <div className="h-full">
        <h1 className="text-2xl font-bold mb-6">Gerenciamento de Grupos</h1>
        
        {showMembersView && currentGroup ? (
          <GrupoMembrosView 
            grupo={currentGroup} 
            onBack={handleBackFromMembers} 
          />
        ) : (
          <GruposListaView 
            onCreateClick={handleCreateClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            onManageMembers={handleManageMembers}
          />
        )}

        <GrupoModal 
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmitGroup}
          title={isCreating ? "Criar Novo Grupo" : "Editar Grupo"}
          grupo={currentGroup}
        />

        <DeleteGrupoDialog 
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          grupo={currentGroup}
          isDeleting={isDeleting}
        />
      </div>
    </SidebarLayout>
  );
};

export default GruposPage;
