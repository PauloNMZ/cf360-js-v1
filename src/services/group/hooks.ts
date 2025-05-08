
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Group, NewGroup, NewGroupMember } from "@/types/group";
import { getGroups, getGroupById, createGroup, updateGroup, deleteGroup } from "./groupOperations";
import { getGroupMembers, addGroupMember, removeGroupMember } from "./memberOperations";

// Hook for group operations with toast notifications
export const useGroupOperations = () => {
  const { toast } = useToast();
  
  const fetchGroups = async () => {
    try {
      return await getGroups();
    } catch (error: any) {
      toast({
        title: "Erro ao carregar grupos",
        description: error.message || "Falha ao buscar dados",
        variant: "destructive",
      });
      return [];
    }
  };
  
  const fetchGroupDetails = async (id: string) => {
    try {
      return await getGroupById(id);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar detalhes do grupo",
        description: error.message || "Falha ao buscar dados",
        variant: "destructive",
      });
      return null;
    }
  };
  
  const fetchGroupMembers = async (groupId: string) => {
    try {
      return await getGroupMembers(groupId);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar membros do grupo",
        description: error.message || "Falha ao buscar dados",
        variant: "destructive",
      });
      return [];
    }
  };
  
  const addGroup = async (group: Omit<NewGroup, "user_id">) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Usuário não autenticado");
      
      const groupWithUser = { 
        ...group,
        user_id: user.data.user.id 
      };
      
      const result = await createGroup(groupWithUser);
      toast({
        title: "Grupo criado",
        description: `${group.nome} foi adicionado com sucesso`,
      });
      return result;
    } catch (error: any) {
      toast({
        title: "Erro ao criar grupo",
        description: error.message || "Falha ao criar grupo",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const editGroup = async (id: string, group: Partial<Omit<NewGroup, "user_id">>) => {
    try {
      const result = await updateGroup(id, group);
      toast({
        title: "Grupo atualizado",
        description: "Alterações salvas com sucesso",
      });
      return result;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar grupo",
        description: error.message || "Falha ao atualizar dados",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const removeGroup = async (id: string) => {
    try {
      await deleteGroup(id);
      toast({
        title: "Grupo removido",
        description: "Item excluído com sucesso",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao remover grupo",
        description: error.message || "Falha ao excluir item",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const addMemberToGroup = async (member: NewGroupMember) => {
    try {
      const result = await addGroupMember(member);
      toast({
        title: "Membro adicionado",
        description: "Favorecido adicionado ao grupo com sucesso",
      });
      return result;
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar membro",
        description: error.message || "Falha ao adicionar favorecido ao grupo",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const removeMemberFromGroup = async (memberId: string) => {
    try {
      await removeGroupMember(memberId);
      toast({
        title: "Membro removido",
        description: "Favorecido removido do grupo com sucesso",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao remover membro",
        description: error.message || "Falha ao remover favorecido do grupo",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return {
    fetchGroups,
    fetchGroupDetails,
    fetchGroupMembers,
    addGroup,
    editGroup,
    removeGroup,
    addMemberToGroup,
    removeMemberFromGroup
  };
};
