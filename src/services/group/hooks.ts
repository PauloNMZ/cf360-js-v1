
import { supabase } from "@/integrations/supabase/client";
import { Group, NewGroup, NewGroupMember } from "@/types/group";
import { getGroups, getGroupById, createGroup, updateGroup, deleteGroup } from "./groupOperations";
import { getGroupMembers, addGroupMember, removeGroupMember, updateGroupMember } from "./memberOperations";

// Hook for group operations without toast notifications - parent components handle notifications
export const useGroupOperations = () => {
  
  const fetchGroups = async () => {
    try {
      return await getGroups();
    } catch (error: any) {
      console.error("Erro ao carregar grupos:", error);
      throw error; // Let parent component handle error notification
    }
  };
  
  const fetchGroupDetails = async (id: string) => {
    try {
      return await getGroupById(id);
    } catch (error: any) {
      console.error("Erro ao carregar detalhes do grupo:", error);
      throw error; // Let parent component handle error notification
    }
  };
  
  const fetchGroupMembers = async (groupId: string) => {
    try {
      return await getGroupMembers(groupId);
    } catch (error: any) {
      console.error("Erro ao carregar membros do grupo:", error);
      throw error; // Let parent component handle error notification
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
      console.log("Grupo criado com sucesso:", group.nome);
      return result;
    } catch (error: any) {
      console.error("Erro ao criar grupo:", error);
      throw error; // Let parent component handle error notification
    }
  };
  
  const editGroup = async (id: string, group: Partial<Omit<NewGroup, "user_id">>) => {
    try {
      const result = await updateGroup(id, group);
      console.log("Grupo atualizado com sucesso");
      return result;
    } catch (error: any) {
      console.error("Erro ao atualizar grupo:", error);
      throw error; // Let parent component handle error notification
    }
  };
  
  const removeGroup = async (id: string) => {
    try {
      await deleteGroup(id);
      console.log("Grupo removido com sucesso");
      return true;
    } catch (error: any) {
      console.error("Erro ao remover grupo:", error);
      throw error; // Let parent component handle error notification
    }
  };
  
  const addMemberToGroup = async (member: NewGroupMember) => {
    try {
      const result = await addGroupMember(member);
      console.log("Membro adicionado ao grupo com sucesso");
      return result;
    } catch (error: any) {
      console.error("Erro ao adicionar membro:", error);
      throw error; // Let parent component handle error notification
    }
  };
  
  const removeMemberFromGroup = async (memberId: string) => {
    try {
      await removeGroupMember(memberId);
      console.log("Membro removido do grupo com sucesso");
      return true;
    } catch (error: any) {
      console.error("Erro ao remover membro:", error);
      throw error; // Let parent component handle error notification
    }
  };
  
  const updateMemberInGroup = async (memberId: string, updates: Partial<NewGroupMember>) => {
    try {
      const result = await updateGroupMember(memberId, updates);
      console.log("Membro atualizado com sucesso");
      return result;
    } catch (error: any) {
      console.error("Erro ao atualizar membro:", error);
      throw error; // Let parent component handle error notification
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
    removeMemberFromGroup,
    updateMemberInGroup
  };
};
