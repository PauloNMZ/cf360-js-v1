import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  buttonText: string;
  onButtonClick: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  onOpenChange,
  title,
  message,
  buttonText,
  onButtonClick,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col items-center justify-center text-center p-8">
        <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{message}</p>
        <Button onClick={onButtonClick}>{buttonText}</Button>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal; 