
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AdminPanel from "@/components/AdminPanel";

type AdminPanelModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const AdminPanelModal = ({ isOpen, onOpenChange }: AdminPanelModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6">Painel de Setup</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <AdminPanel />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanelModal;
