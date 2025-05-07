
import { useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useModalHandlers } from "./event-handlers/useModalHandlers";
import { useActionHandlers } from "./event-handlers/useActionHandlers";
import { useMainNavHandlers } from "./event-handlers/useMainNavHandlers";
import { IndexPageActionProps } from "@/providers/types";

export const useIndexPageEventHandlers = ({
  indexPage,
  indexPageActions,
  setCnabToApiModalOpen
}: IndexPageActionProps) => {
  const { signOut } = useAuth();
  
  // Get action helpers
  const { isActionAllowed, handleSaveClick, actionInProgressRef } = useActionHandlers({
    indexPage,
    indexPageActions,
    isDeleting: indexPageActions.isDeleting
  });
  
  // Get modal handlers
  const { handleConvenenteModalOpenChange, handleEdit } = useModalHandlers({
    indexPage,
    isDeleting: indexPageActions.isDeleting,
    actionInProgressRef
  });
  
  // Get navigation handlers
  const navigationHandlers = useMainNavHandlers({
    indexPage,
    setCnabToApiModalOpen,
    isActionAllowed,
    actionInProgressRef,
    signOut
  });

  return {
    // Modal handlers
    handleConvenenteModalOpenChange,
    handleEdit,
    
    // Save handler
    handleSaveClick,
    
    // Navigation handlers
    ...navigationHandlers
  };
};
