
import React from 'react';
import FavorecidoFormModal from "@/components/favorecidos/FavorecidoFormModal";
import DeleteFavorecidoDialog from "@/components/favorecidos/DeleteFavorecidoDialog";
import { NotificationModal } from "@/components/ui/NotificationModal";

interface LancamentoFavorecidosDialogsProps {
  // Workflow dialog props
  showWorkflowDialog: boolean;
  setShowWorkflowDialog: (show: boolean) => void;
  workflow: any;
  updateWorkflow: (updates: any) => void;
  currentStep: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  handleSubmitWorkflow: () => void;
  isCurrentStepValid: boolean;
  convenentes: any[];
  carregandoConvenentes: boolean;
  getTotalSteps: () => number;
  getDisplayStepNumber: () => number;
  getStepTitle: () => string;
  
  // Directory dialog props
  showDirectoryDialog: boolean;
  setShowDirectoryDialog: (show: boolean) => void;
  handleSaveDirectorySettings: (settings: any) => void;
  
  // PDF dialog props
  showPDFPreviewDialog: boolean;
  setShowPDFPreviewDialog: (show: boolean) => void;
  reportData: any;
  showEmailConfigDialog: boolean;
  setShowEmailConfigDialog: (show: boolean) => void;
  defaultEmailMessage: string;
  reportDate: string;
  handleSendEmailReport: () => void;
  handleEmailSubmit: (config: any) => void;
  
  // Form modal props
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  currentFavorecido: any;
  grupos: any[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSave: () => void;
  formMode: 'create' | 'edit';
  isLoading: boolean;
  
  // Delete dialog props
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  confirmDelete: () => void;
  
  // Notification modal props
  notificationModalOpen: boolean;
  setNotificationModalOpen: () => void;
  notificationConfig: any;
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
