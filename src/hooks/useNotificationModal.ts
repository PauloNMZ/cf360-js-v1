
import { useState } from 'react';
import { NotificationType } from '@/components/ui/NotificationModal';

interface NotificationModalConfig {
  type: NotificationType;
  title: string;
  message: string;
  buttonText: string;
}

export const useNotificationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<NotificationModalConfig>({
    type: 'success',
    title: "Sucesso!",
    message: "",
    buttonText: "OK"
  });

  const showNotification = (
    type: NotificationType,
    title: string,
    message: string,
    buttonText: string = "OK"
  ) => {
    setConfig({ type, title, message, buttonText });
    setIsOpen(true);
  };

  const showSuccess = (
    title: string = "Sucesso!",
    message: string,
    buttonText: string = "OK"
  ) => {
    showNotification('success', title, message, buttonText);
  };

  const showError = (
    title: string = "Erro!",
    message: string,
    buttonText: string = "OK"
  ) => {
    showNotification('error', title, message, buttonText);
  };

  const showWarning = (
    title: string = "Atenção!",
    message: string,
    buttonText: string = "OK"
  ) => {
    showNotification('warning', title, message, buttonText);
  };

  const showInfo = (
    title: string = "Informação",
    message: string,
    buttonText: string = "OK"
  ) => {
    showNotification('info', title, message, buttonText);
  };

  const hideNotification = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    config,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
    setIsOpen
  };
};
