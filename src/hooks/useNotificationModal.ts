
// Re-creating this hook as a bridge to maintain compatibility
// All new code should use useNotificationModalContext directly
import { useNotificationModalContext } from '@/components/ui/NotificationModalProvider';

export const useNotificationModal = () => {
  const { showSuccess, showError, showWarning, showInfo } = useNotificationModalContext();
  
  return {
    showSuccess,
    showError, 
    showWarning,
    showInfo,
    isOpen: false, // Legacy compatibility
    config: { type: 'success' as const, title: '', message: '', buttonText: 'OK' }, // Legacy compatibility
    hideNotification: () => {} // Legacy compatibility
  };
};
