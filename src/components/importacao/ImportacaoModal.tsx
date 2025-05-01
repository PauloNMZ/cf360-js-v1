
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ImportarPlanilha from "@/components/ImportarPlanilha";

type ImportacaoModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const ImportacaoModal = ({ isOpen, onOpenChange }: ImportacaoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6">Importação de Planilha</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <ImportarPlanilha />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportacaoModal;
