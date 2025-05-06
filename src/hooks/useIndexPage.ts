
import { useIndexPageModal } from "./index-page/useIndexPageModal";
import { useIndexPageData } from "./index-page/useIndexPageData";

/**
 * Main hook for the Index page state management
 * Combines modal state, data handling, and search functionality
 */
export const useIndexPage = () => {
  // Use our new hooks
  const modalState = useIndexPageModal();
  const convenenteData = useIndexPageData(modalState.modalOpen);
  
  // Return all the state and functions from our hooks
  return {
    // Modal states from useIndexPageModal
    ...modalState,
    
    // Form, data and search states from useIndexPageData
    ...convenenteData,
  };
};
