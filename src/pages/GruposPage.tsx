
import React, { useState } from "react";
import GruposListaView from "@/components/grupos/GruposListaView";
import GrupoModal from "@/components/grupos/GrupoModal";
import DeleteGrupoDialog from "@/components/grupos/DeleteGrupoDialog";
import GrupoMembrosView from "@/components/grupos/GrupoMembrosView";
import { useGroupOperations } from "@/services/group/hooks";
import { Group, NewGroup } from "@/types/group";
import { useNotificationModalContext } from "@/components/ui/NotificationModalProvider";

const GruposPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showMembersView, setShowMembersView] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<Group | undefined>(undefined);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { addGroup, editGroup, removeGroup } = useGroupOperations();
  const { showSuccess, showError } = useNotificationModalContext();

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
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSubmitGroup = async (data: Partial<NewGroup>) => {
    try {
      if (!data.nome || !data.nome.trim()) {
        showError("Erro!", "O nome do grupo é obrigatório");
        return;
      }

      const sanitizedData = {
        ...data,
        tipo_servico_id: data.tipo_servico_id || null,
        data_pagamento: data.data_pagamento || null
      };

      if (isCreating) {
        await addGroup(sanitizedData as Omit<NewGroup, "user_id">);
        showSuccess("Sucesso!", "Grupo criado com sucesso");
        setRefreshTrigger(prev => prev + 1);
      } else if (currentGroup) {
        await editGroup(currentGroup.id, sanitizedData);
        showSuccess("Sucesso!", "Grupo atualizado com sucesso");
        setRefreshTrigger(prev => prev + 1);
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar grupo:", error);
      showError("Erro!", "Erro ao salvar grupo");
    }
  };

  const handleConfirmDelete = async () => {
    if (currentGroup) {
      setIsDeleting(true);
      try {
        await removeGroup(currentGroup.id);
        setDeleteDialogOpen(false);
        showSuccess("Sucesso!", "Grupo excluído com sucesso");
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error("Erro ao excluir grupo:", error);
        showError("Erro!", "Erro ao excluir grupo");
      } finally {
        setIsDeleting(false);
        setCurrentGroup(undefined);
      }
    }
  };

  return (
    <div className="h-full">
      {showMembersView && currentGroup ? (
        <GrupoMembrosView grupo={currentGroup} onBack={handleBackFromMembers} />
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
