
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useGroupOperations } from "@/services/group/hooks";
import { Group } from "@/types/group";
import { Plus, Edit, Trash2, Users, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface GruposListaViewProps {
  onCreateClick: () => void;
  onEditClick: (group: Group) => void;
  onDeleteClick: (group: Group) => void;
  onManageMembers: (group: Group) => void;
  refreshTrigger?: number;
}

const GruposListaView: React.FC<GruposListaViewProps> = ({
  onCreateClick,
  onEditClick,
  onDeleteClick,
  onManageMembers,
  refreshTrigger = 0
}) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { fetchGroups } = useGroupOperations();

  // Effect that runs when component mounts or refreshTrigger changes
  useEffect(() => {
    loadGroups();
  }, [refreshTrigger]); // Added refreshTrigger dependency

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredGroups(groups);
    } else {
      const termo = searchTerm.trim().toLowerCase();
      setFilteredGroups(
        groups.filter((group) => 
          group.nome.toLowerCase().includes(termo) || 
          (group.descricao && group.descricao.toLowerCase().includes(termo))
        )
      );
    }
  }, [searchTerm, groups]);

  const loadGroups = async () => {
    setIsLoading(true);
    try {
      const data = await fetchGroups();
      setGroups(data);
      setFilteredGroups(data);
    } catch (error) {
      console.error("Erro ao carregar grupos:", error);
      toast.error("Não foi possível carregar os grupos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Grupos de Favorecidos</CardTitle>
        <Button onClick={onCreateClick}>
          <Plus size={16} className="mr-1" />
          Novo Grupo
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <div className="relative w-64"> {/* Reduced width to 16rem (64) */}
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nome ou descrição..." // Updated placeholder text
              className="pl-8"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-8">
            {searchTerm.trim() !== "" ? (
              <p className="text-muted-foreground">Nenhum grupo encontrado para "{searchTerm}"</p>
            ) : (
              <>
                <p className="text-muted-foreground">Nenhum grupo encontrado</p>
                <Button variant="outline" className="mt-4" onClick={onCreateClick}>
                  <Plus size={16} className="mr-1" />
                  Criar Novo Grupo
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredGroups.map((group) => (
              <div 
                key={group.id} 
                className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
              >
                <div>
                  <h3 className="font-medium">{group.nome}</h3>
                  <p className="text-sm text-muted-foreground">{group.descricao || "Sem descrição"}</p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => onManageMembers(group)}
                    title="Gerenciar membros"
                  >
                    <Users size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => onEditClick(group)}
                    title="Editar grupo"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => onDeleteClick(group)}
                    title="Excluir grupo"
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
    </Card>
  );
};

export default GruposListaView;
