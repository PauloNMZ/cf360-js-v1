
import { supabase } from "@/integrations/supabase/client";
import { GroupMember, NewGroupMember } from "@/types/group";

// Get all members of a group with favorecido details
export const getGroupMembers = async (groupId: string): Promise<GroupMember[]> => {
  try {
    // First, get the group members
    const { data: membersData, error: membersError } = await supabase
      .from('favorecidos_grupos')
      .select('*')
      .eq('grupo_id', groupId);
      
    if (membersError) {
      console.error('Error fetching group members:', membersError);
      throw new Error(membersError.message);
    }
    
    if (!membersData || membersData.length === 0) {
      return [];
    }
    
    // Get unique favorecido IDs
    const favorecidoIds = membersData.map(member => member.favorecido_id);
    
    // Fetch favorecidos data
    const { data: favorecidosData, error: favorecidosError } = await supabase
      .from('favorecidos')
      .select('id, nome')
      .in('id', favorecidoIds);
      
    if (favorecidosError) {
      console.error('Error fetching favorecidos:', favorecidosError);
      throw new Error(favorecidosError.message);
    }
    
    // Combine the data
    const transformedData = membersData.map(member => {
      const favorecido = favorecidosData?.find(f => f.id === member.favorecido_id);
      return {
        ...member,
        favorecido: favorecido || { id: member.favorecido_id, nome: 'Nome não encontrado' }
      };
    });
    
    return transformedData;
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
      .select('*')
      .single();
      
    if (error) {
      console.error('Error adding group member:', error);
      throw new Error(error.message);
    }
    
    // Fetch the favorecido data
    const { data: favorecidoData, error: favorecidoError } = await supabase
      .from('favorecidos')
      .select('id, nome')
      .eq('id', data.favorecido_id)
      .single();
      
    if (favorecidoError) {
      console.error('Error fetching favorecido:', favorecidoError);
      throw new Error(favorecidoError.message);
    }
    
    // Transform the data to match our expected structure
    const transformedData = {
      ...data,
      favorecido: favorecidoData
    };
    
    return transformedData;
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

// Get a specific member by ID
export const getGroupMemberById = async (memberId: string): Promise<GroupMember | null> => {
  try {
    const { data, error } = await supabase
      .from('favorecidos_grupos')
      .select('*')
      .eq('id', memberId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      console.error('Error fetching group member:', error);
      throw new Error(error.message);
    }
    
    // Fetch the favorecido data
    const { data: favorecidoData, error: favorecidoError } = await supabase
      .from('favorecidos')
      .select('id, nome')
      .eq('id', data.favorecido_id)
      .single();
      
    if (favorecidoError) {
      console.error('Error fetching favorecido:', favorecidoError);
      throw new Error(favorecidoError.message);
    }
    
    // Transform the data to match our expected structure
    const transformedData = {
      ...data,
      favorecido: favorecidoData
    };
    
    return transformedData;
  } catch (error) {
    console.error('Error in getGroupMemberById:', error);
    throw error;
  }
};

// Update a group member
export const updateGroupMember = async (memberId: string, updates: Partial<NewGroupMember>): Promise<GroupMember> => {
  try {
    const { data, error } = await supabase
      .from('favorecidos_grupos')
      .update(updates)
      .eq('id', memberId)
      .select('*')
      .single();
      
    if (error) {
      console.error('Error updating group member:', error);
      throw new Error(error.message);
    }
    
    // Fetch the favorecido data
    const { data: favorecidoData, error: favorecidoError } = await supabase
      .from('favorecidos')
      .select('id, nome')
      .eq('id', data.favorecido_id)
      .single();
      
    if (favorecidoError) {
      console.error('Error fetching favorecido:', favorecidoError);
      throw new Error(favorecidoError.message);
    }
    
    // Transform the data to match our expected structure
    const transformedData = {
      ...data,
      favorecido: favorecidoData
    };
    
    return transformedData;
  } catch (error) {
    console.error('Error in updateGroupMember:', error);
    throw error;
  }
};
