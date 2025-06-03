import React from 'react';
import FavorecidoFormModal from "@/components/favorecidos/FavorecidoFormModal";
import DeleteFavorecidoDialog from "@/components/favorecidos/DeleteFavorecidoDialog";
import NotificationModal from "@/components/ui/NotificationModal";

interface LancamentoFavorecidosDialogsProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  currentFavorecido: any;
  grupos: any[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSave: () => void;
  formMode: 'create' | 'edit';
  isLoading: boolean;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  confirmDelete: () => void;
  notificationModalOpen: boolean;
  setNotificationModalOpen: () => void;
  notificationConfig: {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    buttonText: string;
  };
  onCloseNotificationModal: () => void;
}

const LancamentoFavorecidosDialogs: React.FC<LancamentoFavorecidosDialogsProps> = ({
  modalOpen,
  setModalOpen,
  currentFavorecido,
  grupos,
  handleInputChange,
  handleSelectChange,
  handleSave,
  formMode,
  isLoading,
  deleteDialogOpen,
  setDeleteDialogOpen,
  confirmDelete,
  notificationModalOpen,
  setNotificationModalOpen,
  notificationConfig,
  onCloseNotificationModal
}) => {
  return (
    <>
      {/* Form Modal */}
      <FavorecidoFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        currentFavorecido={currentFavorecido}
        grupos={grupos}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleSave={handleSave}
        formMode={formMode}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteFavorecidoDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isDeleting={isLoading}
      />

      {/* Notification Modal */}
      {notificationModalOpen && (
        <NotificationModal
          isOpen={notificationModalOpen}
          onClose={onCloseNotificationModal}
          type={notificationConfig.type}
          title={notificationConfig.title}
          message={notificationConfig.message}
          buttonText={notificationConfig.buttonText}
        />
      )}
    </>
  );
};

export default LancamentoFavorecidosDialogs;
