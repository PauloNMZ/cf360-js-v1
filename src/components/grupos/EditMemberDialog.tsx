
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GroupMember } from "@/types/group";

interface EditMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (memberId: string, valor?: number) => void;
  member: GroupMember | null;
}

const EditMemberDialog: React.FC<EditMemberDialogProps> = ({
  isOpen,
  onClose,
  onUpdate,
  member
}) => {
  const [valor, setValor] = useState<string>("");

  React.useEffect(() => {
    if (member) {
      setValor(member.valor ? member.valor.toString() : "");
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (member) {
      onUpdate(
        member.id, 
        valor ? parseFloat(valor) : undefined
      );
    }
  };

  const handleClose = () => {
    setValor("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Editar Membro do Grupo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nome do Favorecido</Label>
            <Input
              value={member?.favorecido?.nome || ""}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valor">Valor</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Valor"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberDialog;
