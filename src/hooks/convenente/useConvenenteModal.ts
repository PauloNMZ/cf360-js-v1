
import { useState } from "react";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";

export const useConvenenteModal = () => {
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Form mode state
  const [formMode, setFormMode] = useState<'view' | 'create' | 'edit'>('view');
  
  // Reset data loaded when modal is closed
  const resetFormOnModalClose = () => {
    if (!modalOpen) {
      // Reset the form data when modal closes
      setFormMode('view');
    }
  };

  return {
    modalOpen,
    setModalOpen,
    importModalOpen,
    setImportModalOpen,
    adminPanelOpen,
    setAdminPanelOpen,
    showDeleteDialog,
    setShowDeleteDialog,
    formMode,
    setFormMode,
    resetFormOnModalClose
  };
};
