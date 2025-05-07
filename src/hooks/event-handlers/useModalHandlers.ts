
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";

export const useModalHandlers = ({
  indexPage,
  isDeleting,
  actionInProgressRef
}: {
  indexPage: any;
  isDeleting: boolean;
  actionInProgressRef: React.MutableRefObject<boolean>;
}) => {
  const { toast } = useToast();
  const modalStateChangingRef = useRef(false);
  const editStateChangingRef = useRef(false);

  // Improved function to handle opening/closing the convenente modal
  const handleConvenenteModalOpenChange = (open: boolean) => {
    // Prevent re-entrant changes or during deletion
    if (isDeleting || modalStateChangingRef.current) {
      console.log("Modal state change blocked: Operation in progress");
      return;
    }
    
    modalStateChangingRef.current = true;
    
    try {
      // Update modal state
      indexPage.setModalOpen(open);
      
      // Reset form data when closing the modal
      if (!open) {
        // IMPORTANT: Set form mode first to 'view'
        indexPage.setFormMode('view');
        
        // Wait for mode change to take effect before clearing data
        setTimeout(() => {
          indexPage.setFormData({...emptyConvenente});
          indexPage.setCurrentConvenenteId(null);
          indexPage.setFormValid(false);
        }, 100);
      }
    } finally {
      // Release state change lock after a delay to prevent race conditions
      setTimeout(() => {
        modalStateChangingRef.current = false;
      }, 200);
    }
  };

  // Improved function to handle edit mode
  const handleEdit = () => {
    if (isDeleting || editStateChangingRef.current) {
      console.log("Edit mode change blocked: Operation in progress");
      return;
    }
    
    editStateChangingRef.current = true;
    
    try {
      // Only enter edit mode if we're not already in edit mode
      // and we have a selected convenente
      if (indexPage.formMode !== 'edit' && indexPage.currentConvenenteId) {
        console.log("Entering edit mode for convenente:", indexPage.currentConvenenteId);
        indexPage.setFormMode('edit');
      }
    } finally {
      // Release the edit state change lock after a delay
      setTimeout(() => {
        editStateChangingRef.current = false;
      }, 300);
    }
  };

  return {
    handleConvenenteModalOpenChange,
    handleEdit
  };
};
