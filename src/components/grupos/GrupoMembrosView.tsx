
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useGroupOperations } from "@/services/group/hooks";
import { Group, GroupMember } from "@/types/group";
import { Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { FavorecidoData } from "@/types/favorecido";
import { useFavorecidos } from "@/hooks/favorecidos/useFavorecidos";

interface GrupoMembrosViewProps {
  grupo: Group;
  onBack: () => void;
}

const GrupoMembrosView: React.FC<GrupoMembrosViewProps> = ({ grupo, onBack }) => {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { fetchGroupMembers, addMemberToGroup, removeMemberFromGroup } = useGroupOperations();

  useEffect(() => {
    if (grupo) {
      loadMembers();
    }
  }, [grupo]);

  const loadMembers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchGroupMembers(grupo.id);
      setMembers(data);
    } catch (error) {
      console.error("Erro ao carregar membros do grupo:", error);
      toast.error("Não foi possível carregar os membros do grupo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async (favorecidoId: string, valor?: number) => {
    try {
      await addMemberToGroup({
        grupo_id: grupo.id,
        favorecido_id: favorecidoId,
        valor: valor
      });
      setIsAddDialogOpen(false);
      loadMembers();
      toast.success("Favorecido adicionado ao grupo");
    } catch (error) {
      console.error("Erro ao adicionar membro ao grupo:", error);
      toast.error("Erro ao adicionar favorecido ao grupo");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMemberFromGroup(memberId);
      loadMembers();
      toast.success("Favorecido removido do grupo");
    } catch (error) {
      console.error("Erro ao remover membro do grupo:", error);
      toast.error("Erro ao remover favorecido do grupo");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Membros do Grupo: {grupo.nome}</CardTitle>
          <p className="text-sm text-muted-foreground">{grupo.descricao}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus size={16} className="mr-1" />
            Adicionar Favorecido
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum favorecido neste grupo</p>
            <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus size={16} className="mr-1" />
              Adicionar Favorecido
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {members.map((member) => (
              <div 
                key={member.id} 
                className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
              >
                <div>
                  <h3 className="font-medium">{member.favorecido_id}</h3>
                  <p className="text-sm text-muted-foreground">
                    Valor: {member.valor ? `R$ ${member.valor.toFixed(2)}` : "Não definido"}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleRemoveMember(member.id)}
                    title="Remover do grupo"
                    className="hover:bg-red-100 dark:hover:bg-red-900"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Add Member Dialog */}
      <AddMemberDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)} 
        onAdd={handleAddMember}
      />
    </Card>
  );
};

interface AddMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (favorecidoId: string, valor?: number) => void;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [favorecidoId, setFavorecidoId] = useState("");
  const [valor, setValor] = useState<string>("");
  const { favorecidos, isLoading } = useFavorecidos();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (favorecidoId) {
      onAdd(
        favorecidoId, 
        valor ? parseFloat(valor) : undefined
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Adicionar Favorecido ao Grupo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="favorecidoId">Nome do Favorecido</Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={favorecidoId}
                onValueChange={setFavorecidoId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um favorecido" />
                </SelectTrigger>
                <SelectContent>
                  {favorecidos.map((favorecido) => (
                    <SelectItem key={favorecido.id} value={favorecido.id}>
                      {favorecido.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="valor">Valor (opcional)</Label>
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!favorecidoId}>
              Adicionar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GrupoMembrosView;
