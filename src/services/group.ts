
import { supabase } from "@/integrations/supabase/client";
import { Group, NewGroup, GroupMember, NewGroupMember } from "@/types/group";
import { useToast } from "@/hooks/use-toast";

// Get all groups for current user
export const getGroups = async (): Promise<Group[]> => {
  try {
    const { data, error } = await supabase
      .from('grupos_favorecidos')
      .select('*')
      .order('nome', { ascending: true });
      
    if (error) {
      console.error('Error fetching groups:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getGroups:', error);
    throw error;
  }
};

// Get a specific group by ID with service type details
export const getGroupById = async (id: string): Promise<Group | null> => {
  try {
    const { data, error } = await supabase
      .from('grupos_favorecidos')
      .select(`
        *,
        tipos_servico:tipo_servico_id(id, codigo, nome)
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      console.error('Error fetching group:', error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error in getGroupById:', error);
    throw error;
  }
};

// Create a new group
export const createGroup = async (group: NewGroup): Promise<Group> => {
  try {
    // user_id is now included in NewGroup interface
    const { data, error } = await supabase
      .from('grupos_favorecidos')
      .insert(group)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating group:', error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error in createGroup:', error);
    throw error;
  }
};

// Update a group
export const updateGroup = async (id: string, group: Partial<NewGroup>): Promise<Group> => {
  try {
    // We're not updating user_id, so we don't need to worry about it here
    const { data, error } = await supabase
      .from('grupos_favorecidos')
      .update(group)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating group:', error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateGroup:', error);
    throw error;
  }
};

// Delete a group
export const deleteGroup = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('grupos_favorecidos')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting group:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error in deleteGroup:', error);
    throw error;
  }
};

// Get all members of a group
export const getGroupMembers = async (groupId: string): Promise<GroupMember[]> => {
  try {
    const { data, error } = await supabase
      .from('favorecidos_grupos')
      .select('*')
      .eq('grupo_id', groupId);
      
    if (error) {
      console.error('Error fetching group members:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getGroupMembers:', error);
    throw error;
  }
};

// Add a member to a group
export const addGroupMember = async (member: NewGroupMember): Promise<GroupMember> => {
  try {
    const { data, error } = await supabase
      .from('favorecidos_grupos')
      .insert(member)
      .select()
      .single();
      
    if (error) {
      console.error('Error adding group member:', error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error in addGroupMember:', error);
    throw error;
  }
};

// Remove a member from a group
export const removeGroupMember = async (memberId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('favorecidos_grupos')
      .delete()
      .eq('id', memberId);
      
    if (error) {
      console.error('Error removing group member:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error in removeGroupMember:', error);
    throw error;
  }
};

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
