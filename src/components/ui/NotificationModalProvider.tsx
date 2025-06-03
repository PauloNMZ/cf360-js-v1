
import React, { createContext, useContext } from 'react';
import { useNotificationModal } from '@/hooks/useNotificationModal';
import NotificationModal, { NotificationType } from './NotificationModal';

interface NotificationModalContextType {
  showSuccess: (title?: string, message?: string, buttonText?: string) => void;
  showError: (title?: string, message?: string, buttonText?: string) => void;
  showWarning: (title?: string, message?: string, buttonText?: string) => void;
  showInfo: (title?: string, message?: string, buttonText?: string) => void;
  showNotification: (type: NotificationType, title: string, message: string, buttonText?: string) => void;
}

const NotificationModalContext = createContext<NotificationModalContextType | undefined>(undefined);

export const useNotificationModalContext = () => {
  const context = useContext(NotificationModalContext);
  if (!context) {
    throw new Error('useNotificationModalContext must be used within a NotificationModalProvider');
  }
  return context;
};

interface NotificationModalProviderProps {
  children: React.ReactNode;
}

export const NotificationModalProvider: React.FC<NotificationModalProviderProps> = ({ children }) => {
  const { 
    isOpen, 
    config, 
    showNotification,
    showSuccess, 
    showError, 
    showWarning, 
    showInfo, 
    hideNotification 
  } = useNotificationModal();

  return (
    <NotificationModalContext.Provider value={{ 
      showSuccess, 
      showError, 
      showWarning, 
      showInfo, 
      showNotification 
    }}>
      {children}
      <NotificationModal
        open={isOpen}
        onOpenChange={hideNotification}
        type={config.type}
        title={config.title}
        message={config.message}
        buttonText={config.buttonText}
        onButtonClick={hideNotification}
      />
    </NotificationModalContext.Provider>
  );
};
