
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: NotificationType;
  title: string;
  message: string;
  buttonText: string;
  onButtonClick: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  open,
  onOpenChange,
  type,
  title,
  message,
  buttonText,
  onButtonClick,
}) => {
  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return { icon: CheckCircle, color: 'text-green-500' };
      case 'error':
        return { icon: X, color: 'text-red-500' };
      case 'warning':
        return { icon: AlertTriangle, color: 'text-orange-500' };
      case 'info':
        return { icon: Info, color: 'text-blue-500' };
      default:
        return { icon: CheckCircle, color: 'text-green-500' };
    }
  };

  const { icon: IconComponent, color } = getIconAndColor();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col items-center justify-center text-center p-8">
        <IconComponent className={`h-12 w-12 ${color} mb-4`} />
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{message}</p>
        <Button onClick={onButtonClick}>{buttonText}</Button>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;
