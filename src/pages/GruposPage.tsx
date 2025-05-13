
import React, { useState } from "react";
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
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger state

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
    // Refresh the groups list when returning from members view
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSubmitGroup = async (data: Partial<NewGroup>) => {
    try {
      // Ensure required field 'nome' is always present
      if (!data.nome || !data.nome.trim()) {
        toast.error("O nome do grupo é obrigatório");
        return;
      }
      
      // Remove any empty strings or convert them to null to avoid validation issues
      const sanitizedData = {
        ...data,
        tipo_servico_id: data.tipo_servico_id || null,
        data_pagamento: data.data_pagamento || null
      };
      
      if (isCreating) {
        await addGroup(sanitizedData as Omit<NewGroup, "user_id">);
        toast.success("Grupo criado com sucesso");
        // Refresh the groups list after creating a new group
        setRefreshTrigger(prev => prev + 1);
      } else if (currentGroup) {
        await editGroup(currentGroup.id, sanitizedData);
        toast.success("Grupo atualizado com sucesso");
        // Refresh the groups list after updating a group
        setRefreshTrigger(prev => prev + 1);
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
        // Refresh the groups list after deleting a group
        setRefreshTrigger(prev => prev + 1);
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
          refreshTrigger={refreshTrigger}
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
  );
};

export default GruposPage;
