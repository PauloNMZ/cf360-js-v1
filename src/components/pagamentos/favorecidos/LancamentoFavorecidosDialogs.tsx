
import React from 'react';
import FavorecidoFormModal from "@/components/favorecidos/FavorecidoFormModal";
import DeleteFavorecidoDialog from "@/components/favorecidos/DeleteFavorecidoDialog";
import NotificationModal from "@/components/ui/NotificationModal";
import WorkflowDialog from "@/components/importacao/WorkflowDialog";

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
  // Workflow props
  showWorkflowDialog?: boolean;
  setShowWorkflowDialog?: (show: boolean) => void;
  workflow?: any;
  updateWorkflow?: (field: string, value: any) => void;
  currentStep?: number;
  getTotalSteps?: () => number;
  getDisplayStepNumber?: () => number;
  getStepTitle?: () => string;
  goToNextStep?: () => void;
  goToPreviousStep?: () => void;
  isCurrentStepValid?: () => boolean;
  handleSubmitWorkflow?: () => void;
  convenentes?: any[];
  carregandoConvenentes?: boolean;
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
  onCloseNotificationModal,
  // Workflow props
  showWorkflowDialog = false,
  setShowWorkflowDialog,
  workflow,
  updateWorkflow,
  currentStep = 1,
  getTotalSteps,
  getDisplayStepNumber,
  getStepTitle,
  goToNextStep,
  goToPreviousStep,
  isCurrentStepValid,
  handleSubmitWorkflow,
  convenentes = [],
  carregandoConvenentes = false
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

      {/* Workflow Dialog */}
      {showWorkflowDialog && setShowWorkflowDialog && workflow && updateWorkflow && (
        <WorkflowDialog
          isOpen={showWorkflowDialog}
          onOpenChange={setShowWorkflowDialog}
          workflow={workflow}
          updateWorkflow={updateWorkflow}
          currentStep={currentStep}
          totalSteps={getTotalSteps ? getTotalSteps() : 4}
          goToNextStep={goToNextStep || (() => {})}
          goToPreviousStep={goToPreviousStep || (() => {})}
          handleSubmit={handleSubmitWorkflow || (() => {})}
          isCurrentStepValid={isCurrentStepValid || (() => true)}
          convenentes={convenentes}
          carregandoConvenentes={carregandoConvenentes}
          getTotalSteps={getTotalSteps}
          getDisplayStepNumber={getDisplayStepNumber}
          getStepTitle={getStepTitle}
        />
      )}

      {/* Notification Modal */}
      {notificationModalOpen && (
        <NotificationModal
          open={notificationModalOpen}
          onOpenChange={(open) => !open && onCloseNotificationModal()}
          type={notificationConfig.type}
          title={notificationConfig.title}
          message={notificationConfig.message}
          buttonText={notificationConfig.buttonText}
          onButtonClick={onCloseNotificationModal}
        />
      )}
    </>
  );
};

export default LancamentoFavorecidosDialogs;
